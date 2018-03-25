import {BaseToDo} from '../to-do/models/base-to-do';
export class ToDo extends BaseToDo {
  id: number;
  description: string;
  time_to_complete_days: number;
  depends_on_todo_ids: number[];
  participants: string[];
  completed: boolean;
  priority: number;
  owner: string;
  created: Date;
  
}


