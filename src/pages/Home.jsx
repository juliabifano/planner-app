import { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import Calendar from "../components/Calendar";

function Home() {
  const getToday = () => {
    const today = new Date();
    const local = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
  };

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [currentDate, setCurrentDate] = useState(() => {
    const [year, month] = getToday().split("-");
    return new Date(Number(year), Number(month) - 1, 1);
  });

  const [tasksByDate, setTasksByDate] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasksByDate));
  }, [tasksByDate]);

  const [activeView, setActiveView] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const tasksToday = tasksByDate[selectedDate] || [];
  const completed = tasksToday.filter((t) => t.completed).length;

  const formattedDate = new Date(selectedDate + "T00:00:00");
  const day = formattedDate.toLocaleDateString("pt-BR", { weekday: "long" });
  const shortDate = formattedDate.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
  const appDate = `${day.charAt(0).toUpperCase() + day.slice(1)} • ${shortDate}`;

  const getWeekTasks = () => {
    const today = new Date(selectedDate + "T00:00:00");
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // domingo
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let total = 0;
    Object.keys(tasksByDate).forEach((date) => {
      const current = new Date(date + "T00:00:00");
      if (current >= startOfWeek && current <= endOfWeek)
        total += tasksByDate[date].length;
    });

    return total;
  };

  const weekTasks = getWeekTasks();

  return (
    <div
      className="page min-h-screen flex font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white/80 dark:bg-white/80 rounded shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-white md:bg-white/80 md:dark:bg-white/80 shadow-md z-50
        transform ${isOpen ? " translate-x-0 " : "-translate-x-full"}
        transition-transform duration-300 md:translate-x-0 `}
      >
        <div className="logo-completa flex justify-center mb-6 mt-6">
          <img
            src="/logo-escura.png"
            alt="Logo"
            className="object-contain w-[200px] md:w-42"
          />
        </div>

        <div className="px-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`text-left p-2 rounded-lg ${activeView === "dashboard" ? "bg-[#6366f1] text-white" : "hover:bg-gray-100"}`}
          >
            ◽ Dashboard
          </button>

          <button
            onClick={() => setActiveView("calendar")}
            className={`text-left p-2 rounded-lg ${activeView === "calendar" ? "bg-[#6366f1] text-white" : "hover:bg-gray-100"}`}
          >
            ◽ Calendário
          </button>

          <button
            onClick={() => {
              setSelectedDate(getToday());
              setActiveView("today");
            }}
            className={`text-left p-2 rounded-lg ${activeView === "today" ? "bg-[#6366f1] text-white" : "hover:bg-gray-100"}`}
          >
            ◽ Hoje
          </button>
        </div>
      </div>
      <div className="page-organization flex-1 flex items-center justify-center p-4 md:ml-64">
        <div className="content flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto items-start">
          {activeView === "calendar" && (
            <>
              <div className="bg-white/70 dark:bg-white/70 backdrop-blur-md p-6 text-base rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition w-full md:w-[450px]">
                <Calendar
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  tasksByDate={tasksByDate}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              </div>

              <div className="bg-white/70 dark:bg-white/70 backdrop-blur-md p-6 text-base rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition w-full md:w-[450px]">
                <TaskList
                  selectedDate={getToday()}
                  tasksByDate={tasksByDate}
                  setTasksByDate={setTasksByDate}
                  showTime={false}
                />
              </div>
            </>
          )}

          {activeView === "dashboard" && (
            <div className="bg-white/70 dark:bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md w-full text-center">
              <p className="text-md text-gray-400 mb-3 tracking-wide pb-1">
                {appDate}
              </p>
              <h2 className="text-2xl font-semibold mb-4">Resumo</h2>
              <p className="text-gray-600 mb-2">
                📅 {weekTasks} tarefas esta semana
              </p>
              <p className="mb-2">🟣 {tasksToday.length} tarefas hoje</p>
              <p className="text-green-600">✔️ {completed} concluídas</p>
            </div>
          )}

          {activeView === "today" && (
            <div className="bg-white/70 dark:bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md w-full text-center shadow-sm hover:shadow-md transition w-full">
              <TaskList
                selectedDate={getToday()}
                tasksByDate={tasksByDate}
                setTasksByDate={setTasksByDate}
                showTime={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
