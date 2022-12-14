import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "../src/shared/Task";
import { signIn, signOut, useSession } from "next-auth/react";
import { TasksController } from "../src/shared/TasksController";

async function fetchTasks(hideCompleted: boolean) {
  //const taskRepo = remult.repo(Task);

  //if (!taskRepo.metadata.apiReadAllowed) return [];
  //if (!remult.repo(Task).metadata.apiReadAllowed) return [];

  return remult.repo(Task).find({
    limit: 20,
    orderBy: { completed: "asc" },
    where: { completed: hideCompleted ? false : undefined },
  });
}

const Home: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchTasks(hideCompleted).then(setTasks);
  }, [hideCompleted]);

  const addTask = () => {
    setTasks([...tasks, new Task()]);
  };

  const setAll = async (completed: boolean) => {
    const taskRepo = remult.repo(Task);

    for (const task of await taskRepo.find()) {
      await taskRepo.save({ ...task, completed });
    }
    //await TasksController.setAll(completed);
    setTasks(await fetchTasks(hideCompleted));
  };

  return (
    <div>
      <header>
        {session ? (
          <>
            Hello {session?.user?.name}{" "}
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign In</button>
        )}
      </header>
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
              alert(error);
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
      <div>
        <button onClick={() => setAll(true)}>Set all as completed</button>
        <button onClick={() => setAll(false)}>Set all as uncompleted</button>
      </div>
    </div>
  );
};

export default Home;
