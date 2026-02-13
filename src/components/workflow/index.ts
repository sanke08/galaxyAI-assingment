/**
 * Workflow Builder - Main Export
 * 
 * This is the main entry point for the workflow builder.
 * Import the WorkflowBuilder component to use the workflow editor.
 * 
 * @example
 * ```tsx
 * import { WorkflowBuilder } from '@/components/workflow';
 * 
 * export default function WorkflowPage({ params }: { params: { id: string } }) {
 *   return <WorkflowBuilder workflowId={params.id} />;
 * }
 * ```
 */

export { WorkflowBuilder } from './workflow-builder';

// Re-export node types for external use
export { workflowNodeTypes } from './nodes';

// Re-export custom edge types
export { customEdgeTypes } from './custom-edges';

// Re-export primitives for custom extensions
export * from './primitives';

// Re-export types
export type * from './types';
