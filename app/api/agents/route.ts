import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch ALL agents OR a SINGLE agent
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const agent = await prisma.agent.findUnique({ where: { id: id } });
      return NextResponse.json({ success: true, agent });
    } 
    
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalExecutions = await prisma.agentData.count({
      where: { collection: 'system_execution_logs' }
    });

    return NextResponse.json({ success: true, agents, totalExecutions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST: Create or Update an agent
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, nodes, edges } = body; // ADDED 'name' HERE

    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: 'My Local Workspace' }
      });
    }

    if (id) {
      const updatedAgent = await prisma.agent.update({
        where: { id: id },
        data: { nodes: nodes, edges: edges }
      });
      return NextResponse.json({ success: true, agent: updatedAgent, action: 'updated' });
    } else {
      // NEW AGENT CREATION WITH USER DEFINED NAME
      const newAgent = await prisma.agent.create({
        data: {
          name: name || 'Untitled Agent', 
          nodes: nodes,
          edges: edges,
          workspaceId: workspace.id,
          status: 'DRAFT'
        }
      });
      return NextResponse.json({ success: true, agent: newAgent, action: 'created' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Agent ID required' }, { status: 400 });
    }

    await prisma.agent.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

// PATCH: Update specific fields like Agent Name
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'ID and Name are required' }, { status: 400 });
    }

    const updatedAgent = await prisma.agent.update({
      where: { id: id },
      data: { name: name }
    });

    return NextResponse.json({ success: true, agent: updatedAgent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update name' }, { status: 500 });
  }
}