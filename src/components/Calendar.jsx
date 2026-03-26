function Calendar({
  selectedDate,
  setSelectedDate,
  tasksByDate,
  currentDate,
  setCurrentDate,
}) {
  const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  const todayDate = new Date();
  const today = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate
    .toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    })
    .replace(" de ", " ");

  return (
    <div className="calendar w-full">
      <div className="flex justify-between items-center mb-4 ">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
          ←
        </button>
        <h2 className="text-lg font-medium capitalize text-[24px]">
          {monthName}
        </h2>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2 text-sm text-gray-400 text-center">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 justify-items-center">
        {[...Array(firstDayOfWeek + daysInMonth)].map((_, i) => {
          const day = i - firstDayOfWeek + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = today === date;

          const isSelected = selectedDate === date;
          const hasTasks = Object.keys(tasksByDate).includes(date);

          console.log("date:", date);
          console.log("tasksByDate[date]:", tasksByDate[date]);
          console.log("hasTasks:", tasksByDate[date]?.length > 0);

          if (day <= 0) {
            return <div key={i}></div>;
          }

          console.log("date:", date);
          console.log("tasksByDate[date]:", tasksByDate[date]);
          console.log("hasTasks:", hasTasks);

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`
              w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all duration-300
               ${
                 isSelected && hasTasks
                   ? "bg-[#4338ca] text-white ring-2 ring-[#c7d2fe] border-2 border-[#a5b4fc]"
                   : isSelected
                     ? "bg-[#6366f1] text-white"
                     : isToday && hasTasks
                       ? "bg-[#c9c9c9] text-[#333333] font-semibold border border-[#333333]"
                       : isToday
                         ? "ring-2 ring-black"
                         : hasTasks
                           ? "bg-[#e0e7ff] text-[#3730a3] font-semibold border border-[#6366f1]"
                           : "hover:bg-gray-200"
               }
`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
