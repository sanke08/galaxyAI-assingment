/**
 * Dashboard Components
 * 
 * Modular components for the dashboard page, migrated from the 'pre' project
 * with premium aesthetics and full functionality.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Folder as FolderIcon, FileText, Pencil, Trash2, FolderInput, Copy, ExternalLink } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface Workflow {
  id: string;
  name: string;
  thumbnail?: string | null;
  folderId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  fileCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ShowcaseItem {
  title: string;
  imageUrl: string;
}

export interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
}

// ============================================================================
// Utilities
// ============================================================================

export function formatTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// ============================================================================
// Showcase Data
// ============================================================================

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    title: 'Weavy Welcome',
    imageUrl: 'https://media.weavy.ai/image/upload/f_auto,q_auto/v1/uploads/gclnmopestmtomr4wk9k?_a=BAMAMiWO0',
  },
  {
    title: 'Weavy Iterators',
    imageUrl: 'https://media.weavy.ai/image/upload/f_auto,q_auto/v1/uploads/1VzevvFzYnfcuq7FDIhlJFZtZW73/q346rdjtgnoljav8ofwi?_a=BAMAMiWO0',
  },
  {
    title: 'Multiple Image Models',
    imageUrl: 'https://media.weavy.ai/image/upload/f_auto,q_auto/v1/uploads/D13KHjm958bJaWyp8KGYlyWGlIj2/nyfxshgadqckp8y3xftr?_a=BAMAMiWO0',
  },
  {
    title: 'Editing Images',
    imageUrl: 'https://media.weavy.ai/image/upload/f_auto,q_auto/v1/uploads/9MzfwEZkPeWMhA20uRTNGSJA4wx2/vlxuswgdgeqxuhgfurfs?_a=BAMAMiWO0',
  },
  {
    title: 'Compositor Node',
    imageUrl: 'https://media.weavy.ai/image/upload/f_auto,q_auto/v1/uploads/D13KHjm958bJaWyp8KGYlyWGlIj2/aak3ssgcgmo9nw2obolo?_a=BAMAMiWO0',
  },
];

// ============================================================================
// Components
// ============================================================================

export function SidebarNavItem({ label, icon, active, disabled, trailing, onClick }: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors',
        active
          ? 'bg-card text-foreground'
          : 'text-foreground/80 hover:bg-card/60 hover:text-foreground',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent'
      )}
    >
      <span className="grid h-8 w-8 place-items-center text-foreground/80">{icon}</span>
      <span className="text-[14px] font-medium">{label}</span>
      <span className="ml-auto text-foreground/80">{trailing}</span>
    </button>
  );
}

export function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <button
      type="button"
      className="relative h-[120px] w-[190px] shrink-0 overflow-hidden rounded-md bg-card shadow-xs hover:ring-2 hover:ring-primary/20 transition-all"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <span className="absolute bottom-3 left-3 right-3 truncate text-[13px] font-medium text-white text-left">
        {item.title}
      </span>
    </button>
  );
}

export interface FileCardProps {
  workflow: Workflow;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (workflow: Workflow) => void;
}

export function FileCard({ workflow, onRename, onDelete, onDuplicate, onMove }: FileCardProps) {
  const router = useRouter();
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(workflow.name);

  const handleOpen = () => {
    router.push(`/dashboard/workflow/${workflow.id}`);
  };

  const handleOpenNewTab = () => {
    window.open(`/dashboard/workflow/${workflow.id}`, '_blank');
  };

  const handleRename = () => {
    if (newName.trim() && newName !== workflow.name) {
      onRename(workflow.id, newName.trim());
    }
    setRenameDialogOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="space-y-2 cursor-pointer group" draggable>
            <button
              type="button"
              onClick={handleOpen}
              className="block w-full overflow-hidden rounded-md border border-border bg-card shadow-xs hover:border-foreground/30 transition-colors"
            >
              <div className="h-[220px] w-full bg-background/40">
                <img
                  src={workflow.thumbnail || 'https://app.weavy.ai/workflow-default-cover.png'}
                  alt="workflow cover"
                  className="h-full w-full object-cover invert"
                />
              </div>
            </button>

            <div>
              <div className="text-[16px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {workflow.name}
              </div>
              <div className="text-[14px] text-muted-foreground">
                Last edited {formatTimeAgo(workflow.updatedAt)}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-card border-border">
          <ContextMenuItem onClick={handleOpen} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={handleOpenNewTab} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in a new tab
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onDuplicate(workflow.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onMove(workflow)} className="cursor-pointer">
            <FolderInput className="mr-2 h-4 w-4" />
            Move
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {
            setNewName(workflow.name);
            setRenameDialogOpen(true);
          }} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(workflow.id)}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Rename workflow</DialogTitle>
            <DialogDescription>
              Enter a new name for your workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Workflow name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} className="bg-[#faffc7] text-black hover:bg-[#f4f8cd]">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export interface FolderCardProps {
  folder: Folder;
  onOpen: (folder: Folder) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onMove: (folder: Folder) => void;
}

export function FolderCard({ folder, onOpen, onRename, onDelete, onMove }: FolderCardProps) {
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(folder.name);

  const handleOpen = () => {
    onOpen(folder);
  };

  const handleOpenNewTab = () => {
    window.open(`/dashboard?folderId=${folder.id}`, '_blank');
  };

  const handleRename = () => {
    if (newName.trim() && newName !== folder.name) {
      onRename(folder.id, newName.trim());
    }
    setRenameDialogOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            onClick={handleOpen}
            className="group space-y-2 text-left"
          >
            <div className="flex h-[220px] w-full items-center justify-center rounded-md border border-border bg-card shadow-xs transition-colors hover:border-foreground/30">
              <img
                src="https://app.weavy.ai/icons/folder.svg"
                alt="folder"
                className="h-16 w-16 opacity-80 invert"
              />
            </div>
            <div>
              <div className="text-[16px] font-medium text-foreground group-hover:text-primary transition-colors">{folder.name}</div>
              <div className="text-[14px] text-muted-foreground">{folder.fileCount || 0} Files</div>
            </div>
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-card border-border">
          <ContextMenuItem onClick={handleOpen} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={handleOpenNewTab} className="cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in a new tab
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => {
            setNewName(folder.name);
            setRenameDialogOpen(true);
          }} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onMove(folder)} className="cursor-pointer">
            <FolderInput className="mr-2 h-4 w-4" />
            Move
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(folder.id)}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>
              Enter a new name for your folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Folder name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} className="bg-[#faffc7] text-black hover:bg-[#f4f8cd]">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export interface MoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow | null;
  folders: Folder[];
  selectedTarget: string | null;
  onSelectTarget: (folderId: string | null) => void;
  onMove: () => void;
}

export function MoveDialog({
  open,
  onOpenChange,
  workflow,
  folders,
  selectedTarget,
  onSelectTarget,
  onMove,
}: MoveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Move workflow</DialogTitle>
          <DialogDescription>
            Select a destination folder for "{workflow?.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto">
          {/* Root folder option */}
          <button
            type="button"
            onClick={() => onSelectTarget(null)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              selectedTarget === null
                ? 'bg-primary/10 border border-primary/50'
                : 'hover:bg-muted/40 border border-transparent'
            )}
          >
            <FolderIcon className="h-5 w-5 text-foreground/60" />
            <span className="text-sm">My files (root)</span>
          </button>

          {/* Folder options */}
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => onSelectTarget(folder.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                selectedTarget === folder.id
                  ? 'bg-primary/10 border border-primary/50'
                  : 'hover:bg-muted/40 border border-transparent'
              )}
            >
              <FolderIcon className="h-5 w-5 text-foreground/60" />
              <span className="text-sm">{folder.name}</span>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onMove} className="bg-[#faffc7] text-black hover:bg-[#f4f8cd]">
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onCreate: () => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  folderName,
  onFolderNameChange,
  onCreate,
}: CreateFolderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create new folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            placeholder="Folder name"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCreate();
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate} className="bg-[#faffc7] text-black hover:bg-[#f4f8cd]">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
