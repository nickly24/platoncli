import React, { useState, useEffect } from 'react';
import './App.css'; // Создайте этот файл для стилей

function App() {
  const [grades, setGrades] = useState({});
  const [newGrade, setNewGrade] = useState({ student_name: '', subject: '', grade: '' });
  const [deleteGrade, setDeleteGrade] = useState({ student_name: '', subject: '', grade_index: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_URL = 'https://nickly24-platonserv-0772.twc1.net/api'; // Замените на ваш URL


  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGrades(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  const handleDeleteChange = (e) => {
    setDeleteGrade({ ...deleteGrade, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/add_grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGrade),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);

      }
      // Обновляем оценки после успешного добавления
      const updatedGrades = await fetch(API_URL).then(res => res.json());
      setGrades(updatedGrades);
      setNewGrade({ student_name: '', subject: '', grade: '' }); // Очищаем форму
    } catch (error) {
      setError(error);
    }
  };


  const handleDeleteSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch(`${API_URL}/delete_grade`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(deleteGrade),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          // Обновляем оценки после успешного удаления
          const updatedGrades = await fetch(API_URL).then(res => res.json());
          setGrades(updatedGrades);
          setDeleteGrade({ student_name: '', subject: '', grade_index: '' }); // Очищаем форму

      } catch (error) {
          setError(error);
      }
  };


  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error.message}</p>;
  }

  return (
    <div className="container">
      <h1>Дневник Оценок</h1>

      <div className="grades-container">
        {Object.keys(grades).length === 0 ? (
          <p>Нет данных об оценках.</p>
        ) : (
          Object.entries(grades).map(([student, subjects]) => (
            <div key={student} className="student-grades">
              <h2>{student}</h2>
              {Object.entries(subjects).map(([subject, gradesList]) => (
                <div key={subject} className="subject-grades">
                  <h3>{subject}</h3>
                  <ul>
                    {gradesList.map((grade, index) => (
                      <li key={index}>Оценка: {grade}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="forms-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Добавить оценку</h2>
        <label>
          Имя ученика:
          <input
            type="text"
            name="student_name"
            value={newGrade.student_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Предмет:
          <input
            type="text"
            name="subject"
            value={newGrade.subject}
            onChange={handleChange}
          />
        </label>
        <label>
          Оценка:
          <input
            type="number"
            name="grade"
            value={newGrade.grade}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Добавить</button>
      </form>

      <form onSubmit={handleDeleteSubmit} className="form">
        <h2>Удалить оценку</h2>
        <label>
          Имя ученика:
          <input
            type="text"
            name="student_name"
            value={deleteGrade.student_name}
            onChange={handleDeleteChange}
          />
        </label>
        <label>
          Предмет:
          <input
            type="text"
            name="subject"
            value={deleteGrade.subject}
            onChange={handleDeleteChange}
          />
        </label>
        <label>
          Индекс оценки:
          <input
            type="number"
            name="grade_index"
            value={deleteGrade.grade_index}
            onChange={handleDeleteChange}
          />
        </label>
        <button type="submit">Удалить</button>
      </form>
      </div>

    </div>
  );
}

export default App;