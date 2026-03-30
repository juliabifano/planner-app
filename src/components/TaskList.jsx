import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TaskList({ selectedDate, tasksByDate, setTasksByDate, showTime }) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [time, setTime] = useState("");

  const rawTasks = tasksByDate[selectedDate] || [];

  const tasks = showTime
    ? rawTasks.slice().sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      })
    : rawTasks;
  const formattedDate = new Date(selectedDate + "T00:00:00");

  return (
    <div className="list">
      <h2 className="text-xl font-bold mb-1 text-center capitalize">
        {formattedDate.toLocaleDateString("pt-BR", {
          weekday: "long",
        })}
      </h2>

      <p className="text-sm text-gray-500 text-center mb-[10px]">
        {formattedDate.toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <input
        className="w-full border rounded-lg p-2 mb-3 text-center"
        placeholder="Digite sua tarefa"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!input.trim()) return;

            setTasksByDate((prev) => ({
              ...prev,
              [selectedDate]: [
                ...(prev[selectedDate] || []),
                {
                  id: Date.now(),
                  text: input,
                  completed: false,
                  time: time || null,
                },
              ],
            }));

            setInput("");
            setTime("");
          }
        }}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border rounded-lg p-2 text-center mb-3 text-gray-500"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-[#6366f1] text-white p-2 text-base rounded-lg mb-4"
        onClick={() => {
          if (!input.trim()) return;

          setTasksByDate((prev) => ({
            ...prev,
            [selectedDate]: [
              ...(prev[selectedDate] || []),
              {
                id: Date.now(),
                text: input,
                completed: false,
                time: time || null,
              },
            ],
          }));

          setInput("");
          setTime("");
        }}
      >
        Adicionar Tarefa
      </motion.button>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => {
            const text = task.text;
            const completed = task.completed;

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-gray-100 p-3 text-base rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updatedTasks = rawTasks.map((t) => {
                        if (t.id !== task.id) return t;

                        return { ...t, completed: !t.completed };
                      });

                      setTasksByDate((prev) => ({
                        ...prev,
                        [selectedDate]: updatedTasks,
                      }));
                    }}
                    className="text-lg"
                  >
                    {completed ? "✔️" : "○"}
                  </button>

                  {editingId === task.id ? (
                    <>
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border rounded px-2 py-1"
                      />

                      <button
                        onClick={() => {
                          const updatedTasks = rawTasks.map((t) => {
                            if (t.id !== task.id) return t;

                            return { ...t, text: editText };
                          });

                          setTasksByDate((prev) => ({
                            ...prev,
                            [selectedDate]: updatedTasks,
                          }));

                          setEditingId(null);
                          setEditText("");
                        }}
                        className="text-green-500 text-sm"
                      >
                        salvar
                      </button>
                    </>
                  ) : (
                    <motion.span
                      animate={{
                        opacity: completed ? 0.5 : 1,
                        scale: completed ? 0.98 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer ${
                        completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {showTime && (
                        <span className="w-14 inline-block font-semibold text-gray-600 mr-2">
                          {task.time || "--:--"}
                        </span>
                      )}
                      {text}
                    </motion.span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditText(text);
                    }}
                    className="text-purple-500 text-sm hover:text-purple-700 mr-[3px] transition"
                  >
                    🖉
                  </button>
                  <button
                    onClick={() => {
                      const updatedTasks = rawTasks.filter(
                        (t) => t.id !== task.id,
                      );

                      setTasksByDate((prev) => {
                        const newState = { ...prev };

                        if (updatedTasks.length === 0) {
                          delete newState[selectedDate];
                        } else {
                          newState[selectedDate] = updatedTasks;
                        }

                        return newState;
                      });
                    }}
                    className="text-red-500 text-sm hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TaskList;
