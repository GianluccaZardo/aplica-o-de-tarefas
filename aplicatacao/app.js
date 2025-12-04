const { useState, useEffect, useContext, createContext } = React;
const { BrowserRouter, Routes, Route, Link, useNavigate, useParams } = ReactRouterDOM;

/* CONTEXTO GLOBAL DAS TAREFAS */
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks([...tasks, task]);

  const removeTask = (id) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const editTask = (updated) =>
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, editTask }}>
      {children}
    </TaskContext.Provider>
  );
};

/* PÁGINA HOME — LISTA DE TAREFAS */
const Home = () => {
  const { tasks, removeTask } = useContext(TaskContext);

  return (
    <div className="container">
      <h2>Tarefas</h2>

      <Link to="/add">Adicionar Tarefa</Link>

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title}
            <span>
              <Link to={`/edit/${t.id}`}>Editar</Link>
              <button onClick={() => removeTask(t.id)}>X</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* FORMULÁRIO DE ADICIONAR / EDITAR */
const TaskForm = ({ isEdit }) => {
  const { tasks, addTask, editTask } = useContext(TaskContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const taskToEdit = tasks.find((t) => t.id == id);
  const [title, setTitle] = useState(taskToEdit?.title || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      editTask({ id: Number(id), title });
    } else {
      addTask({
        id: Date.now(),
        title
      });
    }

    navigate("/");
  };

  return (
    <div className="container">
      <h2>{isEdit ? "Editar Tarefa" : "Adicionar Tarefa"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite a tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">{isEdit ? "Salvar" : "Adicionar"}</button>
      </form>
    </div>
  );
};

/* APP PRINCIPAL */
const App = () => {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<TaskForm isEdit={false} />} />
          <Route path="/edit/:id" element={<TaskForm isEdit={true} />} />
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
};

/* Renderização */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
