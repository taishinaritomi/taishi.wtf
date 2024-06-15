export function getAge(birthday: Date) {
  const today = new Date();

  const currentBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate(),
  );

  const age = today.getFullYear() - birthday.getFullYear();

  return today < currentBirthday ? age - 1 : age;
}
