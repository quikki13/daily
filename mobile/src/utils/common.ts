const map1 = ["a", "b", "c"];
const map2 = ["aa", "bb", "cc"];
const map3 = ["aaa", "bbb", "ccc"];

const map = [map1, map2, map3];

const getRandomMapIndex = () => Math.floor(Math.random() * 3);
export const getUUID = () =>
  `${Math.floor(Math.random() * 10000)}_${map[getRandomMapIndex()][getRandomMapIndex()]}_${map[getRandomMapIndex()][getRandomMapIndex()]}`;
