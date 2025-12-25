import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItem {
  id: number;
  title: string;
  date: string;
  urgent: boolean;
  done: boolean;
}

interface TodoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: TodoItem | null;
  onSave: (todo: Omit<TodoItem, "id"> & { id?: number }) => void;
}

const TodoModal = ({ open, onOpenChange, todo, onSave }: TodoModalProps) => {
  const [title, setTitle] = useState(todo?.title || "");
  const [urgent, setUrgent] = useState(todo?.urgent || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: todo?.id,
      title: title.trim(),
      date: todo?.date || new Date().toISOString().slice(0, 19).replace("T", " "),
      urgent,
      done: todo?.done || false,
    });
    
    setTitle("");
    setUrgent(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{todo ? "Edit To-Do" : "Add New To-Do"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="h-12"
                autoFocus
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={urgent}
                onCheckedChange={(checked) => setUrgent(checked === true)}
              />
              <Label htmlFor="urgent" className="text-sm font-normal cursor-pointer">
                Mark as urgent
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {todo ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoModal;
