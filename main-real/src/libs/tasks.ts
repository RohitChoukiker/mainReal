// types/task.ts
export interface Task {
    id: number;
    title: string;
    assignedBy: string;
    dueDate: string;
    status: 'Pending' | 'Completed';
    assignedTo: string;
  }
  
  // lib/tasks.ts
  export const tasks: Task[] = [
    {
      id: 1,
      title: "Complete project documentation",
      assignedBy: "TC",
      dueDate: "2025-03-28",
      status: "Pending",
      assignedTo: "Agent1"
    },
    // Add more mock tasks as needed
  ];