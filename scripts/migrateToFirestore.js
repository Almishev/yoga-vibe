/**
 * Скрипт за миграция на данни от exercises.json към Firebase Firestore
 * 
 * ИЗПОЛЗВАНЕ:
 * 1. Инсталирай зависимостите: npm install firebase-admin
 * 2. Изтегли serviceAccountKey.json от Firebase Console (ако нямаш)
 * 3. Стартирай: node scripts/migrateToFirestore.js
 * 
 * БЕЛЕЖКА: Скриптът проверява дали курсовете вече съществуват и ги пропуска
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Проверка за serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ГРЕШКА: serviceAccountKey.json не е намерен!');
  console.log('\n📋 ИНСТРУКЦИИ:');
  console.log('1. Отиди в Firebase Console: https://console.firebase.google.com/');
  console.log('2. Избери проекта: yoga-vibe-4bdc3');
  console.log('3. Отиди на Project Settings (⚙️) > Service Accounts');
  console.log('4. Кликни "Generate New Private Key"');
  console.log('5. Запази файла като serviceAccountKey.json в папката Yoga-Vibe/');
  console.log('6. ⚠️  ВАЖНО: Добави serviceAccountKey.json в .gitignore!');
  process.exit(1);
}

// Зареждане на service account key
const serviceAccount = require(serviceAccountPath);

// Инициализация на Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin инициализиран успешно\n');
}

const db = admin.firestore();

// Четене на exercises.json
const exercisesPath = path.join(__dirname, '..', 'assets', 'data', 'exercises.json');

if (!fs.existsSync(exercisesPath)) {
  console.error('❌ ГРЕШКА: exercises.json не е намерен!');
  console.log(`Очакван път: ${exercisesPath}`);
  process.exit(1);
}

const exercisesData = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

/**
 * Мапва level към difficulty
 */
function mapLevelToDifficulty(level) {
  const mapping = {
    'beginner': 'beginner',
    'intermediate': 'intermediate',
    'advanced': 'advanced'
  };
  return mapping[level] || 'beginner';
}

/**
 * Мапва duration (число) към duration (string)
 */
function mapDuration(duration) {
  if (typeof duration === 'number') {
    return `${duration} минути`;
  }
  return duration || '30 минути';
}

/**
 * Проверява дали курс съществува
 */
async function courseExists(courseId) {
  try {
    const courseRef = db.collection('courses').doc(courseId);
    const doc = await courseRef.get();
    return doc.exists;
  } catch (error) {
    console.error(`Грешка при проверка на курс ${courseId}:`, error);
    return false;
  }
}

/**
 * Мигрира един курс
 */
async function migrateCourse(courseData) {
  const courseId = courseData.id;
  
  // Проверка дали курсът вече съществува
  if (await courseExists(courseId)) {
    console.log(`⏭️  Курс "${courseData.title}" вече съществува, пропускам...`);
    return courseId;
  }

  try {
    // Подготовка на данните за курса
    const courseDoc = {
      title: courseData.title,
      description: courseData.description || '',
      difficulty: mapLevelToDifficulty(courseData.level),
      duration: mapDuration(courseData.duration),
      style: courseData.style || '',
      focus: courseData.focus || '',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    // Създаване на курса
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.set(courseDoc);
    console.log(`✅ Курс "${courseData.title}" създаден успешно`);

    return courseId;
  } catch (error) {
    console.error(`❌ Грешка при създаване на курс "${courseData.title}":`, error.message);
    return null;
  }
}

/**
 * Мигрира асани за даден курс
 */
async function migrateAsanas(courseId, asanasData) {
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const asanaData of asanasData) {
    const asanaId = asanaData.id;

    try {
      // Проверка дали асаната вече съществува
      const asanaRef = db.collection('asanas').doc(asanaId);
      const asanaDoc = await asanaRef.get();

      if (asanaDoc.exists) {
        console.log(`  ⏭️  Асана "${asanaData.name}" вече съществува, пропускам...`);
        skipCount++;
        continue;
      }

      // Подготовка на данните за асаната
      const asanaDocData = {
        name: asanaData.name,
        description: asanaData.description || '',
        benefits: Array.isArray(asanaData.benefits) ? asanaData.benefits : [],
        executionTime: asanaData.executionTime || 0,
        image: asanaData.image || '',
        courseId: courseId,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      };

      // Създаване на асаната
      await asanaRef.set(asanaDocData);
      console.log(`  ✅ Асана "${asanaData.name}" създадена успешно`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Грешка при създаване на асана "${asanaData.name}":`, error.message);
      errorCount++;
    }
  }

  return { successCount, skipCount, errorCount };
}

/**
 * Главна функция за миграция
 */
async function migrate() {
  console.log('🚀 Започвам миграция на данни от JSON към Firestore...\n');

  const courses = exercisesData.courses || [];
  
  if (courses.length === 0) {
    console.log('⚠️  Няма курсове за миграция в exercises.json');
    process.exit(0);
  }

  console.log(`📚 Намерени ${courses.length} курса за миграция\n`);

  let totalCoursesMigrated = 0;
  let totalCoursesSkipped = 0;
  let totalAsanasMigrated = 0;
  let totalAsanasSkipped = 0;
  let totalAsanasErrors = 0;

  for (const courseData of courses) {
    console.log(`\n📖 Обработвам курс: "${courseData.title}"`);
    
    const courseId = await migrateCourse(courseData);
    
    if (!courseId) {
      console.log(`❌ Не успях да създам курс "${courseData.title}", пропускам асаните...`);
      continue;
    }

    if (await courseExists(courseId) && (await db.collection('courses').doc(courseId).get()).exists) {
      // Проверяваме дали курсът беше създаден сега или вече съществуваше
      const existingDoc = await db.collection('courses').doc(courseId).get();
      const createdNow = existingDoc.data()?.createdAt?.toMillis() > Date.now() - 5000;
      
      if (!createdNow) {
        totalCoursesSkipped++;
      } else {
        totalCoursesMigrated++;
      }
    } else {
      totalCoursesMigrated++;
    }

    // Мигриране на асаните
    const asanas = courseData.asanas || [];
    if (asanas.length > 0) {
      console.log(`  🧘 Обработвам ${asanas.length} асани...`);
      const result = await migrateAsanas(courseId, asanas);
      totalAsanasMigrated += result.successCount;
      totalAsanasSkipped += result.skipCount;
      totalAsanasErrors += result.errorCount;
    } else {
      console.log(`  ℹ️  Няма асани в този курс`);
    }
  }

  // Обобщение
  console.log('\n' + '='.repeat(50));
  console.log('📊 ОБОБЩЕНИЕ НА МИГРАЦИЯТА:');
  console.log('='.repeat(50));
  console.log(`✅ Курсове създадени: ${totalCoursesMigrated}`);
  console.log(`⏭️  Курсове пропуснати (вече съществуват): ${totalCoursesSkipped}`);
  console.log(`✅ Асани създадени: ${totalAsanasMigrated}`);
  console.log(`⏭️  Асани пропуснати (вече съществуват): ${totalAsanasSkipped}`);
  if (totalAsanasErrors > 0) {
    console.log(`❌ Асани с грешки: ${totalAsanasErrors}`);
  }
  console.log('='.repeat(50));
  console.log('\n✅ Миграцията завърши успешно!');
  
  process.exit(0);
}

// Стартиране на миграцията
migrate().catch((error) => {
  console.error('\n❌ КРИТИЧНА ГРЕШКА:', error);
  process.exit(1);
});

