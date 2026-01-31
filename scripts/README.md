# Скриптове за миграция

## Миграция на данни от JSON към Firestore

### Стъпка 1: Инсталирай зависимостите

```bash
cd Yoga-Vibe
npm install firebase-admin
```

### Стъпка 2: Изтегли Service Account Key

**Опция A: Ако вече имаш файл в `react-admin/`**
- Можеш да копираш `serviceAccountKey.json` от `react-admin/` в `Yoga-Vibe/`
- Същият файл работи за двата проекта (същият Firebase проект)

**Опция B: Ако нямаш файл**
1. Отиди в [Firebase Console](https://console.firebase.google.com/)
2. Избери проекта `yoga-vibe-4bdc3`
3. Отиди на **Project Settings** (⚙️) > **Service Accounts**
4. Кликни на **Generate New Private Key**
5. Запази файла като `serviceAccountKey.json` в папката `Yoga-Vibe/`

⚠️ **ВАЖНО**: Файлът вече е добавен в `.gitignore` (не го комитирай!)

### Стъпка 3: Стартирай миграцията

```bash
node scripts/migrateToFirestore.js
```

### Какво прави скриптът:

1. Чете данните от `assets/data/exercises.json`
2. Мапва `level` → `difficulty` (beginner/intermediate/advanced)
3. Мапва `duration` (число) → `duration` (string, напр. "30 минути")
4. Създава курсове в `courses` колекцията
5. За всеки курс, създава асаните в `asanas` колекцията с `courseId`
6. Проверява дали данните вече съществуват (за да не се дублират)

### Резултат:

След успешна миграция:
- Всички курсове ще бъдат в `courses` колекцията
- Всички асани ще бъдат в `asanas` колекцията с правилния `courseId`
- Данните ще могат да се четат от Yoga-Vibe приложението

---

## Обновяване на Firestore Security Rules

### Важно: Обнови Firestore Rules за да позволиш read достъп

1. Отиди в [Firebase Console](https://console.firebase.google.com/)
2. Избери проекта `yoga-vibe-4bdc3`
3. Отиди на **Firestore Database** > **Rules**
4. Замени правилата с:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Курсове - read достъп за всички, write само за админи
    match /courses/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Асани - read достъп за всички, write само за админи
    match /asanas/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

5. Кликни **Publish**

### Защо е необходимо:

- `allow read: if true` - позволява на всички потребители да четат курсове и асани (необходимо за Yoga-Vibe приложението)
- `allow write: if request.auth != null && request.auth.token.admin == true` - позволява само на админи да пишат (за react-admin панела)

---

## Безопасност

⚠️ **ВАЖНО**: 
- Никога не комитирай `serviceAccountKey.json` в Git!
- Файлът вече е добавен в `.gitignore`
- Ако случайно го комитираш, веднага го изтрий от Firebase Console и генерирай нов

---

## Отстраняване на проблеми

### Грешка: "serviceAccountKey.json не е намерен"
- Увери се, че файлът е в папката `Yoga-Vibe/`
- Провери дали името е точно `serviceAccountKey.json` (без допълнителни символи)

### Грешка: "exercises.json не е намерен"
- Увери се, че файлът съществува в `Yoga-Vibe/assets/data/exercises.json`

### Грешка: "Cannot find module 'firebase-admin'"
- Инсталирай зависимостите: `npm install firebase-admin`

### Данните не се показват в приложението
- Провери Firestore Rules (виж по-горе)
- Провери дали миграцията е завършила успешно
- Провери дали имаш интернет връзка

