import { ref } from "vue";

export default function usePassword() {
  const HashOptions = ref([
    "plain",
    "md5",
    "sha",
    "sha256",
    "sha512",
    "bcrypt",
  ]);
  return {
    HashOptions,
  };
}
