import { atom, selector, DefaultValue, RecoilState } from "recoil";
import produce from "immer";

interface PostState {
  id: string;
  message: string;
  owner: string;
  user: string;
  createdAt: string;
}

const defaultValue: PostState = {
  id: "",
  message: "",
  owner: "",
  user: "",
  createdAt: "",
};

const atomKeyName: string = "postState";

export const postState = atom({
  key: atomKeyName,
  default: defaultValue,
});

// TODO: 後でちゃんと理解する
export const messageState: RecoilState<string> = (() => {
  const propName: keyof PostState = "message";
  return selector<string>({
    key: atomKeyName + "/" + propName,
    get: ({ get }) => {
      return get(postState)[propName];
    },
    set: ({ set, get }, newValue) => {
      const tempValue: string =
        newValue instanceof DefaultValue ? defaultValue[propName] : newValue;
      const imValue = produce<PostState>(get(postState), (draft) => {
        draft[propName] = tempValue;
      });
      set(postState, imValue);
    },
  });
})();

const postListDefaultValue: PostState[] = [];

export const postListState = atom({
  key: "postListState",
  default: postListDefaultValue,
});
