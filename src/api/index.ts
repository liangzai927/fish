// 递归
// const modulesFiles = import.meta.globEager('./**/*.ts');

// 自动引入modules下所有api
const modulesFiles = import.meta.glob("./modules/*.ts", { eager: true });

const modules = Object.keys(modulesFiles).reduce(
  (modules: { [key: string]: any }, path: string) => {
    // sub.ts => sub
    const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, "$1");

    modules[moduleName] = modulesFiles[path];
    return modules;
  },
  {},
);

export default modules;
