import { ref } from "vue";

export default function usePassword() {
  const HashOptions = ref([
    "plain",
    "md4",
    "md5",
    "ripemd160",
    "sha",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "pbkdf2",
    "bcrypt",
  ]);
  return {
    HashOptions,
  };
}
