import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../src/shared/Task";

async function fetchTasks(hideCompleted: boolean) {
  return remult.repo(Task).find({
    limit: 20,
    orderBy: { completed: "asc" },
    where: { completed: hideCompleted ? false : undefined },
  });
}

const Home: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
  }, [hideCompleted]);
  return (
    <div>
      <input
        type="checkbox"
        checked={hideCompleted}
        onChange={(e) => setHideCompleted(e.target.checked)}
      />
      Hide Completed
      <main>
        {tasks.map((task) => (
          <div key={task.id}>
            <input type="checkbox" checked={task.completed} />
            {task.title}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
