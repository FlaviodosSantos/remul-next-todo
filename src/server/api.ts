import { createRemultServer } from "remult/server";
import { Task } from "../shared/Task";

export const api = createRemultServer({
  entities: [Task],
  initApi: async (remult) => {
    const taskRepo = remult.repo(Task);
    if ((await taskRepo.count()) === 0) {
      await taskRepo.insert([
        { title: "Task a" },
        { title: "Task b", completed: true },
        { title: "Task c" },
        { title: "Task d" },
        { title: "Task e", completed: true },
      ]);
    }
  },
});
