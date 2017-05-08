# Installation

Currently, the Xenon compiler is written in **Node.js**. The current aim is to get out of this stage as quickly as possible and to rewrite the entire compiler in Xenon itself.

Until that is complete, installation of the Xenon compiler requires:
- Node.js (**[Install](https://nodejs.org/en/download/)**)
- NekoVM (**[Install](http://nekovm.org/download)**)

After installing the dependencies, clone [the GitHub repository](https://github.com/lightblub/xenon), run `npm install` and finally execute `npm link`.

The result of this installation process should be that the binaries `neko` and `xe` are added to your path.

## Usage

The compiler, **xe**, converts Xenon source code files (`.xe`) to NekoVM bytecode files (`.n`). Usage is as follows:

```sh
$ xe program.xe
```

The result - provided there are no errors - will be a file named `program.xe.n`. This can be run using the **neko** program:

```sh
$ neko program.xe.n
```
