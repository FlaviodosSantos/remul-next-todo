import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../src/shared/Task";

async function fetchTasks() {
  return remult.repo(Task).find();
}

const Home: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);
  return (
    <div>
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
