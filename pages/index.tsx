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

  const addTask = () => {
    setTasks([...tasks, new Task()]);
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={hideCompleted}
        onChange={(e) => setHideCompleted(e.target.checked)}
      />
      Hide Completed
      <main>
        {tasks.map((task) => {
          const handleChange = (values: Partial<Task>) => {
            setTasks(
              tasks.map((t) => (t === task ? { ...task, ...values } : t))
            );
          };

          const saveTask = async () => {
            try {
              const savedTask = await remult.repo(Task).save(task);
              setTasks(tasks.map((t) => (t === task ? savedTask : t)));
            } catch (error) {
              alert(error.message);
            }
          };

          const deleteTask = async () => {
            await remult.repo(Task).delete(task);
            setTasks(tasks.filter((t) => t !== task));
          };

          return (
            <div key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => handleChange({ completed: e.target.checked })}
              />
              <input
                value={task.title}
                onChange={(e) => handleChange({ title: e.target.value })}
              />
              <button onClick={saveTask}>Save</button>
              <button onClick={deleteTask}>Delete</button>
            </div>
          );
        })}
      </main>
      <button onClick={addTask}>Add Task</button>
    </div>
  );
};

export default Home;
