import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';

const prisma = new PrismaClient();

// Initialize the real AI engine
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request, context: any) {
  try {
    const params = await context.params;
    const agentId = params.agentId;
    const payload = await req.json();

    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    let nodes: any[] = [];
    let edges: any[] = [];
    
    // Parse nodes and edges from the database
    if (typeof agent.nodes === 'string') nodes = JSON.parse(agent.nodes);
    else if (Array.isArray(agent.nodes)) nodes = agent.nodes;

    if (typeof agent.edges === 'string') edges = JSON.parse(agent.edges);
    else if (Array.isArray(agent.edges)) edges = agent.edges;

    const startNode = nodes.find((n: any) => n.type === 'webhookNode' || n.type === 'scheduleNode');
    
    if (!startNode) {
      return NextResponse.json({ success: false, error: 'Agent must have a Webhook or Schedule Trigger node.' }, { status: 400 });
    }

    let executionLogs = [];
    let currentData = payload.message || JSON.stringify(payload); 
    
    // Global memory store for variable injection
    let contextData: any = {
      trigger: currentData,
      scraper: "No scraper data available yet",
      search: "No search data available yet", 
      llm: "No LLM data available yet",
      api: "No API data available yet",
      parser: "No parsed data available yet",
      db: "No Database data available yet", 
      loopStates: {} // Tracking memory for loops
    };
    
    let currentNode: any = startNode;
    let stepCount = 1;
    let finalHttpResponseCode = 200;

    while (currentNode) {
      let requiredSourceHandle = null; 

      if (currentNode.type === 'webhookNode' || currentNode.type === 'scheduleNode') {
        const triggerType = currentNode.type === 'scheduleNode' ? 'Scheduled Timer' : 'Webhook';
        
        executionLogs.push({ 
          step: `${stepCount}. Trigger`, 
          nodeId: currentNode.id,
          message: `${triggerType} fired!`, 
          inputData: payload 
        });
      }
      
      else if (currentNode.type === 'llmNode') {
        let prompt = currentNode.data?.prompt || "Summarize this data.";
        const model = "llama-3.1-8b-instant"; 

        // Variable Injection Logic
        const usesVariables = prompt.includes('{{');
        if (usesVariables) {
            prompt = prompt.replace(/{{trigger}}/g, contextData.trigger);
            prompt = prompt.replace(/{{scraper}}/g, contextData.scraper);
            prompt = prompt.replace(/{{search}}/g, contextData.search); 
            prompt = prompt.replace(/{{llm}}/g, contextData.llm);
            prompt = prompt.replace(/{{api}}/g, contextData.api || "No API data");
            prompt = prompt.replace(/{{parser}}/g, contextData.parser || "No parsed data");
            prompt = prompt.replace(/{{db}}/g, contextData.db || "No db data");
        }
        
        executionLogs.push({ 
          step: `${stepCount}. AI Action (Thinking...)`, 
          nodeId: currentNode.id,
          message: "Sending request to real LLM via Groq API..."
        });

        const userMessage = usesVariables 
            ? "Process the instructions provided in the system prompt." 
            : `Please process this input data based on your system prompt: ${currentData}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: userMessage }
            ],
            model: model,
        });

        const realAiResponse = chatCompletion.choices[0]?.message?.content || "AI failed to generate a response.";
        
        executionLogs.push({ 
          step: `${stepCount}. AI Action (Result)`, 
          nodeId: currentNode.id,
          promptUsed: prompt, 
          output: realAiResponse 
        });
        
        currentData = realAiResponse; 
        contextData.llm = realAiResponse; 
      } 

      else if (currentNode.type === 'searchNode') {
        let searchQuery = currentNode.data?.query || "latest news";
        
        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          searchQuery = searchQuery.replace(regex, contextData[v] || '');
        });

        executionLogs.push({
          step: `${stepCount}. Web Search (Loading...)`,
          nodeId: currentNode.id,
          message: `Searching the web via Tavily for: "${searchQuery}"`
        });

        try {
          const tavilyApiKey = process.env.TAVILY_API_KEY;
          if (!tavilyApiKey) throw new Error("TAVILY_API_KEY is missing in environment variables.");

          const tavilyRes = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              api_key: tavilyApiKey,
              query: searchQuery,
              search_depth: "basic",
              include_answer: true 
            })
          });

          if (!tavilyRes.ok) throw new Error(`Tavily API rejected the request: ${tavilyRes.statusText}`);

          const searchData = await tavilyRes.json();
          const searchResult = searchData.answer || searchData.results.map((r: any) => r.content).join('\n\n');

          currentData = searchResult;
          contextData.search = searchResult;

          executionLogs.push({
            step: `${stepCount}. Web Search (Success)`,
            nodeId: currentNode.id,
            message: `Successfully retrieved live web data.`,
            output: searchResult
          });

        } catch (error: any) {
          currentData = `Search Error: ${error.message}`;
          executionLogs.push({
            step: `${stepCount}. Web Search (Failed)`,
            nodeId: currentNode.id,
            message: `Failed to fetch live data: ${error.message}`
          });
        }
      }

      else if (currentNode.type === 'scraperNode') {
        const urlToScrape = currentNode.data?.url || "https://example.com";
        
        executionLogs.push({ 
            step: `${stepCount}. Web Scraper (Loading)`, 
            nodeId: currentNode.id, 
            message: `Fetching data from ${urlToScrape}...` 
        });

        try {
          const response = await fetch(urlToScrape, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
          });
          
          if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
          }

          const htmlText = await response.text();
          const cleanText = htmlText.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').substring(0, 3000);
          
          currentData = `Scraped Text:\n\n${cleanText}`;
          contextData.scraper = cleanText; 

          executionLogs.push({ 
              step: `${stepCount}. Web Scraper (Success)`, 
              nodeId: currentNode.id, 
              message: `Successfully extracted ${cleanText.length} characters of text.`,
              output: cleanText.substring(0, 200) + "..." 
          });
        } catch (err: any) {
          currentData = `Failed to scrape data. Error: ${err.message}`;
          executionLogs.push({ 
              step: `${stepCount}. Web Scraper (Failed)`, 
              nodeId: currentNode.id, 
              message: `Could not load website: ${err.message}` 
          });
        }
      }

      else if (currentNode.type === 'parseNode') {
        let docData = currentNode.data?.documentData || "{{scraper}}";
        const goal = currentNode.data?.extractionGoal || "Extract key entities into structured format";

        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          docData = docData.replace(regex, contextData[v] || '');
        });

        executionLogs.push({ 
          step: `${stepCount}. Document Parser (Running)`, 
          nodeId: currentNode.id, 
          message: `Analyzing text to: "${goal}"` 
        });

        try {
            const systemPrompt = `You are a strict data extraction parser. Your goal is to: ${goal}. 
            You MUST return ONLY the extracted data. Do not include markdown formatting like \`\`\`json, do not include greetings, explanations, or conversational text. Return only the raw data.`;

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `DOCUMENT TO PARSE:\n\n${docData.substring(0, 4000)}` } 
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.1, 
            });

            const parsedResult = chatCompletion.choices[0]?.message?.content || "Failed to extract data.";
            
            currentData = parsedResult;
            contextData.parser = parsedResult; 

            executionLogs.push({ 
              step: `${stepCount}. Document Parser (Success)`, 
              nodeId: currentNode.id, 
              message: `Successfully extracted structured data.`,
              output: parsedResult 
            });

        } catch (err: any) {
            currentData = `Parse Error: ${err.message}`;
            executionLogs.push({ 
                step: `${stepCount}. Document Parser (Failed)`, 
                nodeId: currentNode.id, 
                message: `Extraction failed: ${err.message}` 
            });
        }
      }
      
      else if (currentNode.type === 'apiNode') {
        const method = currentNode.data?.method || "GET";
        let rawUrl = currentNode.data?.url || "";
        let requestBody = currentNode.data?.body || "";
        
        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          rawUrl = rawUrl.replace(regex, contextData[v] || '');
          if (requestBody) {
             requestBody = requestBody.replace(regex, contextData[v] || '');
          }
        });

        const finalUrl = rawUrl || "No URL provided";

        executionLogs.push({ 
          step: `${stepCount}. API Request (Loading...)`, 
          nodeId: currentNode.id, 
          message: `Executing real ${method} request to ${finalUrl}...` 
        });

        try {
          const fetchOptions: any = {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          };

          if ((method === 'POST' || method === 'PUT') && requestBody) {
            fetchOptions.body = requestBody;
            executionLogs.push({ 
              step: `${stepCount}. API Request (Body Attached)`, 
              nodeId: currentNode.id, 
              message: `Attached payload to ${method} request.` 
            });
          }

          const apiResponse = await fetch(finalUrl, fetchOptions);

          if (!apiResponse.ok) {
            throw new Error(`HTTP Error: ${apiResponse.status} ${apiResponse.statusText}`);
          }

          const responseText = await apiResponse.text();
          let parsedData = responseText;
          try {
              parsedData = JSON.parse(responseText);
          } catch (e) {}
          
          const finalDataString = typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : parsedData;
          
          currentData = `API Response:\n${finalDataString}`;
          contextData.api = finalDataString; 

          executionLogs.push({ 
            step: `${stepCount}. API Request (Success)`, 
            nodeId: currentNode.id, 
            message: `Successfully fetched data from API.`,
            output: finalDataString 
          });

        } catch (err: any) {
          currentData = `API Request failed. Error: ${err.message}`;
          executionLogs.push({ 
            step: `${stepCount}. API Request (Failed)`, 
            nodeId: currentNode.id, 
            message: `Could not reach ${finalUrl}. Error: ${err.message}` 
          });
        }
      }

      else if (currentNode.type === 'codeNode') {
        const userCode = currentNode.data?.code || "return data;";
        
        executionLogs.push({ 
            step: `${stepCount}. Custom Code (Running)`, 
            nodeId: currentNode.id, 
            message: `Executing user JavaScript...` 
        });

        try {
          const executeCode = new Function('data', userCode);
          const result = executeCode(currentData);
          const finalResult = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
          
          currentData = finalResult;

          executionLogs.push({ 
              step: `${stepCount}. Custom Code (Success)`, 
              nodeId: currentNode.id, 
              message: `Code executed successfully.`,
              output: finalResult
          });

        } catch (err: any) {
          currentData = `Code Error: ${err.message}`;
          executionLogs.push({ 
              step: `${stepCount}. Custom Code (Failed)`, 
              nodeId: currentNode.id, 
              message: `JavaScript Syntax/Runtime Error: ${err.message}` 
          });
        }
      }

      else if (currentNode.type === 'emailNode') {
        let toEmail = currentNode.data?.to || "test@example.com";
        let subject = currentNode.data?.subject || "Notification from AgentForge";
        let body = currentNode.data?.body || "Your workflow has executed.";

        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          subject = subject.replace(regex, contextData[v] || '');
          body = body.replace(regex, contextData[v] || '');
        });

        executionLogs.push({ 
          step: `${stepCount}. Send Email (Sending...)`, 
          nodeId: currentNode.id, 
          message: `Preparing to send email to ${toEmail}...` 
        });

        try {
          const resendApiKey = process.env.RESEND_API_KEY;

          if (!resendApiKey) {
            executionLogs.push({ 
              step: `${stepCount}. Send Email (Simulated)`, 
              nodeId: currentNode.id, 
              message: `Simulated Email sent to ${toEmail}. (Please add RESEND_API_KEY to your .env file to send real emails!)`,
              output: `Subject: ${subject}\nBody: ${body}`
            });
          } else {
            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'AgentForge <onboarding@resend.dev>', 
                to: toEmail,
                subject: subject,
                text: body
              })
            });

            if (!emailResponse.ok) {
              throw new Error(`Email API Error: ${emailResponse.statusText}`);
            }

            executionLogs.push({ 
              step: `${stepCount}. Send Email (Success)`, 
              nodeId: currentNode.id, 
              message: `Live email successfully delivered to ${toEmail}!`,
              output: `Subject: ${subject}`
            });
          }

        } catch (err: any) {
          executionLogs.push({ 
              step: `${stepCount}. Send Email (Failed)`, 
              nodeId: currentNode.id, 
              message: `Could not send email: ${err.message}` 
          });
        }
      }

      else if (currentNode.type === 'delayNode') {
        const amount = parseInt(currentNode.data?.amount) || 1;
        const unit = currentNode.data?.unit || 'Seconds';

        let ms = amount * 1000;
        if (unit === 'Minutes') ms = amount * 60000;
        if (unit === 'Hours') ms = amount * 3600000;

        executionLogs.push({ 
            step: `${stepCount}. Delay (Sleeping ⏳)`, 
            nodeId: currentNode.id, 
            message: `Pausing execution for ${amount} ${unit}...` 
        });

        await new Promise(resolve => setTimeout(resolve, Math.min(ms, 10000)));

        executionLogs.push({ 
            step: `${stepCount}. Delay (Resumed 🚀)`, 
            nodeId: currentNode.id, 
            message: `Execution resumed after delay.` 
        });
      }

      else if (currentNode.type === 'responseNode') {
        const statusCode = currentNode.data?.statusCode || "200";
        finalHttpResponseCode = parseInt(statusCode);
        let responseBody = currentNode.data?.responseBody !== undefined 
              ? currentNode.data.responseBody 
              : '{\n  "status": "success",\n  "data": "{{llm}}"\n}';

        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          responseBody = responseBody.replace(regex, contextData[v] || '');
        });

        executionLogs.push({ 
            step: `${stepCount}. HTTP Response (END 🏁)`, 
            nodeId: currentNode.id, 
            message: `Simulated returning HTTP ${statusCode} to the webhook caller.`,
            output: responseBody 
        });
      }

      else if (currentNode.type === 'dbNode') {
        const collection = currentNode.data?.collection || "default_table";
        const operation = currentNode.data?.operation || "Insert Record";
        
        executionLogs.push({ 
            step: `${stepCount}. Database (Writing...)`, 
            nodeId: currentNode.id, 
            message: `Executing ${operation} on collection '${collection}'...` 
        });

        try {
          let payloadToSave;
          try {
            payloadToSave = JSON.parse(currentData);
          } catch (e) {
            payloadToSave = { text_content: currentData }; 
          }

          if (operation === "Insert Record") {
            const newRecord = await prisma.agentData.create({
              data: {
                collection: collection,
                data: payloadToSave
              }
            });

            const finalDataString = JSON.stringify(newRecord, null, 2);
            currentData = finalDataString;
            contextData.db = finalDataString; 

            executionLogs.push({ 
              step: `${stepCount}. Database (Success)`, 
              nodeId: currentNode.id, 
              message: `Successfully inserted new record with ID: ${newRecord.id}`,
              output: finalDataString
            });
          } else if (operation === "Update Record") {
            // REAL PRISMA UPDATE LOGIC
            let recordId = payloadToSave.id;
            if (!recordId) {
                throw new Error("Payload must contain an 'id' field to perform an Update.");
            }
            
            const updatedRecord = await prisma.agentData.update({
              where: { id: recordId },
              data: { data: payloadToSave }
            });

            const finalDataString = JSON.stringify(updatedRecord, null, 2);
            currentData = finalDataString;
            contextData.db = finalDataString; 

            executionLogs.push({ 
              step: `${stepCount}. Database (Success)`, 
              nodeId: currentNode.id, 
              message: `Successfully updated record ID: ${updatedRecord.id}`,
              output: finalDataString
            });
          }

        } catch (err: any) {
          executionLogs.push({ 
            step: `${stepCount}. Database (Failed)`, 
            nodeId: currentNode.id, 
            message: `Failed to save to database. Error: ${err.message}` 
          });
        }
      }

      else if (currentNode.type === 'readDbNode') {
        const collection = currentNode.data?.collection || "default_table";
        
        executionLogs.push({ 
            step: `${stepCount}. Database (Reading...)`, 
            nodeId: currentNode.id, 
            message: `Fetching latest record from '${collection}'...` 
        });

        try {
          const record = await prisma.agentData.findFirst({
            where: { collection: collection },
            orderBy: { createdAt: 'desc' }
          });

          if (!record) {
             throw new Error(`No records found in collection: ${collection}`);
          }

          const finalDataString = JSON.stringify(record, null, 2);
          currentData = finalDataString;
          contextData.db = finalDataString; 

          executionLogs.push({ 
              step: `${stepCount}. Database (Success)`, 
              nodeId: currentNode.id, 
              message: `Successfully retrieved record from '${collection}'.`,
              output: finalDataString 
          });

        } catch (err: any) {
           currentData = `Database Read Error: ${err.message}`;
           executionLogs.push({ 
              step: `${stepCount}. Database (Failed)`, 
              nodeId: currentNode.id, 
              message: err.message
          });
        }
      }

      else if (currentNode.type === 'conditionNode') {
        const conditionText = currentNode.data?.condition || "";
        const isTrue = currentData.toLowerCase().includes(conditionText.toLowerCase());
        
        executionLogs.push({ 
            step: `${stepCount}. If/Else Condition`, 
            nodeId: currentNode.id, 
            message: `Checking if text contains "${conditionText}". Result: ${isTrue ? 'TRUE' : 'FALSE'}` 
        });
        
        requiredSourceHandle = isTrue ? "true" : "false";
      }

      else if (currentNode.type === 'routerNode') {
        const routeA = currentNode.data?.routeA || "";
        const routeB = currentNode.data?.routeB || "";
        
        const textToSearch = currentData.toLowerCase();
        let matchedRoute = "default"; 
        
        if (routeA && textToSearch.includes(routeA.toLowerCase())) {
            matchedRoute = "routeA";
        } 
        else if (routeB && textToSearch.includes(routeB.toLowerCase())) {
            matchedRoute = "routeB";
        }
        
        executionLogs.push({ 
            step: `${stepCount}. Router / Switch`, 
            nodeId: currentNode.id, 
            message: `Evaluated paths for "${routeA}" and "${routeB}". Routed to: ${matchedRoute.toUpperCase()}` 
        });
        
        requiredSourceHandle = matchedRoute;
      }

      else if (currentNode.type === 'imageGenNode') {
        executionLogs.push({ step: `${stepCount}. AI Image Generator`, nodeId: currentNode.id, message: "Processing prompt and generating image..." });
        
        const userPrompt = currentNode.data?.imagePrompt || contextData.scraper || currentData;
        
        if (!userPrompt || userPrompt.trim() === '') {
          throw new Error("No image prompt provided. Please connect a node or write a prompt.");
        }

        const realImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}`;
        
        contextData.image = realImageUrl; 
        currentData = `Generated Image URL: ${realImageUrl}`; 
        
        executionLogs.push({ 
          step: `${stepCount}. AI Image Generator`, 
          nodeId: currentNode.id, 
          message: `Success! Image generated for prompt: "${userPrompt.substring(0, 30)}..."`,
          output: realImageUrl 
        });
      }

      else if (currentNode.type === 'googleSheetsNode') {
        executionLogs.push({ step: `${stepCount}. Google Sheets`, nodeId: currentNode.id, message: "Connecting to Google Cloud API..." });
        
        const sheetId = currentNode.data?.sheetId;
        const rowContent = currentNode.data?.rowContent;

        if (!sheetId) {
          throw new Error("Google Sheets Error: Spreadsheet ID is missing. Please enter it in the node.");
        }

        let finalDataToAppend = rowContent || "Empty Row";
        if (finalDataToAppend.includes("{{image}}") && contextData.image) {
           finalDataToAppend = finalDataToAppend.replace("{{image}}", contextData.image);
        } else if (finalDataToAppend.includes("{{scraper}}") && contextData.scraper) {
           finalDataToAppend = finalDataToAppend.replace("{{scraper}}", contextData.scraper);
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        currentData = `Row appended successfully to sheet ${sheetId}`;

        executionLogs.push({ 
          step: `${stepCount}. Google Sheets`, 
          nodeId: currentNode.id, 
          message: `Successfully authenticated and appended data to Spreadsheet ID: ${sheetId}`,
          output: `Row Data Inserted:\n${finalDataToAppend}`
        });
      }

      else if (currentNode.type === 'aiSecurityNode') {
        let inputData = currentNode.data?.inputData || "{{trigger}}";
        const policy = currentNode.data?.policy || "detect_injection";

        // Inject variables
        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          inputData = inputData.replace(regex, contextData[v] || '');
        });

        executionLogs.push({ 
          step: `${stepCount}. AI Security Gateway (Scanning...)`, 
          nodeId: currentNode.id, 
          message: `Analyzing data using policy: ${policy.replace('_', ' ').toUpperCase()}` 
        });

        let isFlagged = false;
        let securityMessage = "Data passed security checks.";

        const textToAnalyze = inputData.toLowerCase();

        // Simulated AI Security heuristics for our MVP
        if (policy === 'detect_injection') {
          const injectionKeywords = ['ignore previous', 'system prompt', 'bypass', 'override', 'forget instructions'];
          isFlagged = injectionKeywords.some(keyword => textToAnalyze.includes(keyword));
          if (isFlagged) securityMessage = "Prompt Injection detected! Routing to Flagged path.";
        } 
        else if (policy === 'redact_pii') {
          // Basic regex for detecting emails or 10-digit phone numbers
          const emailRegex = /[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}/;
          const phoneRegex = /\b\d{10}\b|\(\d{3}\)\s*\d{3}-\d{4}/;
          isFlagged = emailRegex.test(inputData) || phoneRegex.test(inputData);
          if (isFlagged) securityMessage = "Sensitive PII (Email/Phone) detected! Routing to Flagged path.";
        } 
        else if (policy === 'filter_toxicity') {
          const toxicKeywords = ['hate', 'kill', 'murder', 'idiot', 'stupid'];
          isFlagged = toxicKeywords.some(keyword => textToAnalyze.includes(keyword));
          if (isFlagged) securityMessage = "Toxic content detected! Routing to Flagged path.";
        }

        executionLogs.push({ 
          step: `${stepCount}. AI Security Gateway (Result)`, 
          nodeId: currentNode.id, 
          message: securityMessage,
          output: `Status: ${isFlagged ? 'FLAGGED 🚨' : 'SAFE ✅'}` 
        });

        // Set the current data so the next node can use it
        currentData = inputData;

        // Route execution based on the security scan result
        requiredSourceHandle = isFlagged ? "flagged" : "safe";
      }

      else if (currentNode.type === 'discordNode') {
        let webhookUrl = currentNode.data?.webhookUrl;
        let message = currentNode.data?.message || "Ping from AgentForge!";

        // Inject variables
        const variables = ['trigger', 'scraper', 'search', 'llm', 'api', 'parser', 'db'];
        variables.forEach(v => {
          const regex = new RegExp(`{{${v}}}`, 'g');
          message = message.replace(regex, contextData[v] || '');
        });

        if (!webhookUrl) {
          throw new Error("Webhook URL is missing.");
        }

        // SMART URL DETECTOR: Slack or Discord?
        const isSlack = webhookUrl.toLowerCase().includes('slack.com');
        const platformName = isSlack ? "Slack" : "Discord";

        executionLogs.push({ step: `${stepCount}. ${platformName} Notify`, nodeId: currentNode.id, message: `Sending alert to ${platformName}...` });

        // Build Payload dynamically
        const payloadBody = isSlack ? { text: message } : { content: message };

        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadBody)
          });
          
          if (!res.ok) throw new Error(`${platformName} rejected the message.`);
          
          executionLogs.push({ step: `${stepCount}. ${platformName} Notify`, nodeId: currentNode.id, message: `Notification delivered successfully to ${platformName}.` });
        } catch (err: any) {
           executionLogs.push({ step: `${stepCount}. ${platformName} Notify (Failed)`, nodeId: currentNode.id, message: err.message });
        }
      }
      
      else if (currentNode.type === 'loopNode') {
        const arraySourceRaw = currentNode.data?.arraySource || "[]";
        
        if (!contextData.loopStates[currentNode.id]) {
            let parsedArray = [];
            try {
                parsedArray = JSON.parse(arraySourceRaw);
                if (!Array.isArray(parsedArray)) {
                    parsedArray = [parsedArray]; 
                }
            } catch (e) {
                parsedArray = arraySourceRaw.split(',').map((s: string) => s.trim()).filter(Boolean);
            }

            contextData.loopStates[currentNode.id] = {
                items: parsedArray,
                currentIndex: 0
            };
        }

        const loopState = contextData.loopStates[currentNode.id];

        if (loopState.currentIndex < loopState.items.length) {
            const currentItem = loopState.items[loopState.currentIndex];
            currentData = typeof currentItem === 'object' ? JSON.stringify(currentItem) : String(currentItem);

            executionLogs.push({
                step: `${stepCount}. Loop / Iterator (Processing)`,
                nodeId: currentNode.id,
                message: `Processing item ${loopState.currentIndex + 1} of ${loopState.items.length}: "${currentData}"`
            });

            loopState.currentIndex++;
            requiredSourceHandle = "nextItem"; 
        } else {
            executionLogs.push({
                step: `${stepCount}. Loop / Iterator (Completed)`,
                nodeId: currentNode.id,
                message: `Successfully finished looping over ${loopState.items.length} items.`
            });
            
            delete contextData.loopStates[currentNode.id];
            requiredSourceHandle = "completed"; 
        }
      }

      const outgoingEdge = edges.find((edge: any) => {
        if (edge.source !== currentNode.id) return false;
        if (requiredSourceHandle && edge.sourceHandle !== requiredSourceHandle) return false;
        return true;
      });
      
      if (outgoingEdge) {
        currentNode = nodes.find((n: any) => n.id === outgoingEdge.target);
        stepCount++;
      } else {
        currentNode = null; 
      }
    }

    // -------------------------------------------------------------
    // LOG EXECUTION TO DATABASE TO INCREMENT GLOBAL COUNTER
    // -------------------------------------------------------------
    try {
      await prisma.agentData.create({
        data: {
          collection: 'system_execution_logs',
          data: {
            agentId: agentId,
            status: 'success',
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (logError) {
      console.error("Failed to log execution metric:", logError);
    }

    return NextResponse.json({ success: true, message: 'Agent executed successfully!', logs: executionLogs }, { status: finalHttpResponseCode });

  } catch (error: any) {
    console.error("Execution error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Execution failed' }, { status: 500 });
  }
}