import { createRemultServer } from "remult/server";
import { getUserFromNextAuth } from "../../pages/api/auth/[...nextauth]";
import { Task } from "../shared/Task";
import { TasksController } from "../shared/TasksController";

export const api = createRemultServer({
  entities: [Task],
  controllers: [TasksController],
  getUser: getUserFromNextAuth,
});
