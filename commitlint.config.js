module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [0], // allow scopes like "contracts/native/hello-world" (has a slash)
  },
};
