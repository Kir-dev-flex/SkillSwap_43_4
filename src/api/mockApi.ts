import {
  User,
  Category,
  City,
  Like,
  Notification,
  Skill,
  ExpertUserWithSkill,
  UsersResponse,
  CategoriesResponse,
  CitiesResponse,
  LikesResponse,
  NotificationsResponse,
  SkillsResponse,
} from '../types';

// Константы для ключей LocalStorage
const LS_KEYS = {
  USERS: 'mock_users',
  CATEGORIES: 'mock_categories',
  CITIES: 'mock_cities',
  LIKES: 'mock_likes',
  NOTIFICATIONS: 'mock_notifications',
  SKILLS: 'mock_skills',
} as const;

// Общая функция для загрузки данных из JSON файлов
const fetchMockData = async <T>(fileName: string): Promise<T> => {
  try {
    const response = await fetch(`/db/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileName}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    throw error;
  }
};

// Функция для сохранения данных в LocalStorage
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// Функция для загрузки данных из LocalStorage
const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return null;
  }
};

// Функция getUsers для получения списка пользователей из файла users.json
export const getUsers = async (): Promise<UsersResponse> => {
  // Пробуем получить данные из LocalStorage
  const cachedUsers = loadFromLocalStorage<User[]>(LS_KEYS.USERS);

  if (cachedUsers && cachedUsers.length > 0) {
    return cachedUsers;
  }

  // Если нет в LocalStorage, загружаем из файла
  const response = await fetchMockData<{ users?: User[] }>('users.json');
  const users = Array.isArray(response.users) ? response.users : [];

  // Сохраняем в LocalStorage
  saveToLocalStorage(LS_KEYS.USERS, users);

  return users;
};

// Функция resetUsers для возвращения данных в LocalStorage в исходное состояние
// (идентичное пользователям в users.json)
export const resetUsers = async (): Promise<UsersResponse> => {
  const users = await fetchMockData<User[]>('users.json');
  saveToLocalStorage(LS_KEYS.USERS, users);
  return users;
};

// Функция updateUser для обновления данных пользователя
export const updateUser = async (userData: Partial<User> & { id: number }): Promise<User> => {
  if (!userData.id) {
    throw new Error('User ID is required');
  }

  // Получаем текущих пользователей
  const users = await getUsers();

  // Ищем индекс пользователя
  const userIndex = users.findIndex((user) => user.id === userData.id);

  if (userIndex !== -1) {
    // Обновляем существующего пользователя
    users[userIndex] = { ...users[userIndex], ...userData };
  } else {
    // Добавляем нового пользователя
    const newUser: User = {
      id: userData.id,
      name: userData.name || '',
      location: userData.location || '',
      age: userData.age || 0,
      gender: userData.gender || '',
      avatarUrl: userData.avatarUrl || '',
      birthDate: userData.birthDate || '',
      email: userData.email || '',
      password: userData.password || '',
      skillCanTeach: userData.skillCanTeach || 0,
      subcategoriesWantToLearn: userData.subcategoriesWantToLearn || [],
    };
    users.push(newUser);
  }

  // Сохраняем обновленный список в LocalStorage
  saveToLocalStorage(LS_KEYS.USERS, users);

  // Возвращаем обновленного пользователя
  return users.find((user) => user.id === userData.id)!;
};

// Функция getUserById для получения информации о пользователе по его id
export const getUserById = async (id: number): Promise<User | null> => {
  const users = await getUsers();
  return users.find((user) => user.id === id) || null;
};

// Функция getCategories для получения информации о категориях
export const getCategories = async (): Promise<CategoriesResponse> => {
  const cachedCategories = loadFromLocalStorage<Category[]>(LS_KEYS.CATEGORIES);

  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  const rawData = await fetchMockData<{ categories: Category[] }>('categories.json');
  const categories = Array.isArray(rawData.categories) ? rawData.categories : [];
  saveToLocalStorage(LS_KEYS.CATEGORIES, categories);
  return categories;
};

// Функция getСities для получения информации о городах
export const getCities = async (): Promise<CitiesResponse> => {
  const cachedCities = loadFromLocalStorage<City[]>(LS_KEYS.CITIES);

  if (cachedCities && cachedCities.length > 0) {
    return cachedCities;
  }

  const cities = await fetchMockData<City[]>('cities.json');
  saveToLocalStorage(LS_KEYS.CITIES, cities);
  return cities;
};

// Функция getLikes для получения информации о лайках
export const getLikes = async (): Promise<LikesResponse> => {
  const cachedLikes = loadFromLocalStorage<Like[]>(LS_KEYS.LIKES);

  if (cachedLikes && cachedLikes.length > 0) {
    return cachedLikes;
  }

  const likes = await fetchMockData<Like[]>('likes.json');
  saveToLocalStorage(LS_KEYS.LIKES, likes);
  return likes;
};

// Функция getLikesByUserId для получения информации о лайках,
// которые оставил конкретный пользователь (поле для сортировки userId)
export const getLikesByUserId = async (userId: number): Promise<LikesResponse> => {
  const likes = await getLikes();
  return likes.filter((like) => like.userId === userId);
};

// Функция getNotifications для получения информации об уведомлениях
export const getNotifications = async (): Promise<NotificationsResponse> => {
  const cachedNotifications = loadFromLocalStorage<Notification[]>(LS_KEYS.NOTIFICATIONS);

  if (cachedNotifications && cachedNotifications.length > 0) {
    return cachedNotifications;
  }

  const response = await fetchMockData<{ notifications?: Notification[] }>('notifications.json');
  const notifications = Array.isArray(response.notifications) ? response.notifications : [];
  saveToLocalStorage(LS_KEYS.NOTIFICATIONS, notifications);
  return notifications;
};

// Функция getSkills для получения информации о предложениях
export const getSkills = async (): Promise<SkillsResponse> => {
  const cachedSkills = loadFromLocalStorage<Skill[]>(LS_KEYS.SKILLS);

  if (cachedSkills && cachedSkills.length > 0) {
    return cachedSkills;
  }

  const skills = await fetchMockData<Skill[]>('skills.json');
  saveToLocalStorage(LS_KEYS.SKILLS, skills);
  return skills;
};

// Функция getSkillsById для получения предложения по его id (поле id)
export const getSkillsById = async (id: number): Promise<Skill | null> => {
  const skills = await getSkills();
  return skills.find((skill) => skill.id === id) || null;
};

// Функция getSkillsByUserId для получения предложения по id его владельца (поле userId)
export const getSkillsByUserId = async (userId: number): Promise<SkillsResponse> => {
  const skills = await getSkills();
  return skills.filter((skill) => skill.userId === userId);
};

// Функция getExpertUsersBySkill для получения пользователей, которые могут научить подкатегории из предложения
export const getUsersBySkill = async (skillId: number): Promise<ExpertUserWithSkill[]> => {
  try {
    // 1. Получаем текущее предложение
    const currentSkill = await getSkillsById(skillId);

    if (!currentSkill) {
      console.warn(`Skill with id ${skillId} not found`);
      return [];
    }

    // 2. Получаем подкатегорию из предложения
    const { subcategoryId } = currentSkill;

    // 3. Получаем всех пользователей
    const allUsers = await getUsers();

    // 4. Фильтруем пользователей, которые могут научить этой подкатегории
    const expertUsers = allUsers.filter(
      (user) => user.skillCanTeach === subcategoryId && user.id !== currentSkill.userId
    );

    // 5. Для каждого эксперта находим его предложение (навык)
    const expertUsersWithSkills = await Promise.all(
      expertUsers.map(async (user) => {
        // Получаем все предложения пользователя
        const userSkills = await getSkillsByUserId(user.id);

        // Находим предложение, которое соответствует skillCanTeach пользователя
        const matchingSkill =
          userSkills.find((skill) => skill.subcategoryId === user.skillCanTeach) ||
          userSkills[0] ||
          null; // Если точного совпадения нет, берем первое

        return {
          user,
          skill: matchingSkill,
        };
      })
    );

    return expertUsersWithSkills;
  } catch (error) {
    console.error('Error in getExpertUsersWithSkillsBySkill:', error);
    return [];
  }
};

// Функция для получения полной информации о предложении и его авторе
export const getSkillWithOwnerInfo = async (
  skillId: number
): Promise<{
  skill: Skill;
  owner: User;
} | null> => {
  try {
    const skill = await getSkillsById(skillId);
    if (!skill) return null;

    const owner = await getUserById(skill.userId);
    if (!owner) return null;

    return { skill, owner };
  } catch (error) {
    console.error('Error in getSkillWithOwnerInfo:', error);
    return null;
  }
};

// Экспорт всех функций
export const mockApi = {
  getUsers,
  resetUsers,
  updateUser,
  getUserById,
  getCategories,
  getCities,
  getLikes,
  getLikesByUserId,
  getNotifications,
  getSkills,
  getSkillsById,
  getSkillsByUserId,
  getUsersBySkill,
  getSkillWithOwnerInfo,
};

export default mockApi;
