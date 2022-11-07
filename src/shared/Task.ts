import { Entity, Fields, Validators } from "remult";

@Entity("tasks", {
  allowApiCrud: true,
})
export class Task {
  @Fields.uuid()
  id!: string;

  @Fields.string<Task>({
    validate: (task) => {
      if (task.title.length < 3) throw "Erro: Titulo vazio !";
    },
  })
  title = "";

  @Fields.boolean()
  completed = false;
}
