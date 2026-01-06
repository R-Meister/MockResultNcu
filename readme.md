# CGPA / SGPA Predictor
## The README is generated using a LLM and will be changed later.

A simple web application that helps students predict how their **CGPA** and **SGPA** will change based on expected grades in upcoming courses.

This project is focused on clarity, speed, and usefulness — allowing students to simulate different academic outcomes without manual calculations.

---

## 🚀 Project Goal (V1)

The goal of **Version 1 (MVP)** is to provide a **grade simulation tool** that calculates a student’s expected SGPA and updated CGPA using current academic data and future grade assumptions.

---

## 🎯 What V1 Is Expected to Do

### ✅ Core Features
- Accept **current CGPA / SGPA**
- Accept **completed credits**
- Accept **upcoming course credits**
- Allow users to select or input **expected grades** for future courses
- Calculate:
  - **Expected SGPA** for the upcoming semester
  - **Updated CGPA** after including future grades
- Instantly show result changes when grades are modified

---

## 🧮 Calculation Logic (V1 Scope)

- Uses **credit-weighted GPA formula**
- Assumes:
  - Standard grade-to-point mapping
  - All upcoming courses are completed in the same semester
- No backend dependency (client-side calculation only)

---

## 🧑‍💻 User Flow (V1)

1. User enters current CGPA/SGPA  
2. User enters total completed credits  
3. User adds upcoming courses with credits  
4. User selects expected grade for each course  
5. App calculates and displays:
   - Predicted SGPA
   - Updated CGPA

---

## 🧩 Out of Scope for V1

The following are **intentionally excluded** from Version 1:
- Authentication / user accounts
- Database or result storage
- University-specific grading rules
- PDF export or sharing
- Mobile app support
- Historical semester breakdown

---

## 🛠 Tech Stack (Tentative)

- **Frontend:** HTML, CSS, JavaScript (or React)
- **Backend:** None (V1 is fully client-side)
- **Deployment:** GitHub Pages / Vercel / Netlify

---

## 🔮 Planned for Future Versions

- University-specific grading systems
- Semester-wise GPA breakdown
- Save & compare multiple scenarios
- Visual graphs and progress indicators
- Mobile-friendly enhancements

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🤝 Contributions

Contributions are welcome!  
Feel free to open issues or submit pull requests for improvements or new features.
