import { Workspace, FixedType, SystemProcess, TypedParameter, ValueSet, RequiredProcess } from 'cursive-runtime';

export class IntegerWorkspace extends Workspace {
  constructor() {
    super();
    const integer = new FixedType<number>(
      'integer',
      '#00cc00',
      s => parseInt(s),
      undefined,
      undefined,
      new RegExp('^[0-9]+$'),
    );

    let add: SystemProcess;

    {
      const input1 = new TypedParameter<number>('value 1', integer);
      const input2 = new TypedParameter<number>('value 2', integer);

      const output = new TypedParameter<number>('result', integer);

      add = new SystemProcess(
        'Add',
        'Adds two integers',
        null,
        inputs => {
          const value1 = inputs.get(input1);
          const value2 = inputs.get(input2);

          const outputs = new ValueSet();
          outputs.set(output, value1 + value2);

          return Promise.resolve({
            returnPath: null,
            outputs,
          });
        },
        [input1, input2],
        [output],
        [],
      );

      this.add = async (in1, in2) => {
        const inputs = new ValueSet();

        inputs.set(input1, in1);
        inputs.set(input2, in2);

        const { outputs } = await add.run(inputs);

        return Promise.resolve(outputs!.get(output));
      };
    }

    let subtract: SystemProcess;

    {
      const input1 = new TypedParameter<number>('value 1', integer);
      const input2 = new TypedParameter<number>('value 2', integer);

      const output = new TypedParameter<number>('result', integer);

      subtract = new SystemProcess(
        'Subtract',
        'Subtracts one integer from another',
        null,
        inputs => {
          const value1 = inputs.get(input1);
          const value2 = inputs.get(input2);

          const outputs = new ValueSet();
          outputs.set(output, value1 - value2);

          return Promise.resolve({
            returnPath: null,
            outputs,
          });
        },
        [input1, input2],
        [output],
        [],
      );

      this.subtract = async (in1, in2) => {
        const inputs = new ValueSet();

        inputs.set(input1, in1);
        inputs.set(input2, in2);

        const { outputs } = await subtract.run(inputs);

        return Promise.resolve(outputs!.get(output));
      };
    }

    let multiply: SystemProcess;

    {
      const input1 = new TypedParameter<number>('value 1', integer);
      const input2 = new TypedParameter<number>('value 2', integer);

      const output = new TypedParameter<number>('result', integer);

      multiply = new SystemProcess(
        'Multiply',
        'Multiplies two integers',
        null,
        inputs => {
          const value1 = inputs.get(input1);
          const value2 = inputs.get(input2);

          const outputs = new ValueSet();
          outputs.set(output, value1 * value2);

          return Promise.resolve({
            returnPath: null,
            outputs,
          });
        },
        [input1, input2],
        [output],
        [],
      );

      this.multiply = async (in1, in2) => {
        const inputs = new ValueSet();

        inputs.set(input1, in1);
        inputs.set(input2, in2);

        const { outputs } = await multiply.run(inputs);

        return Promise.resolve(outputs!.get(output));
      };
    }

    let compare: SystemProcess;

    {
      const input1 = new TypedParameter<number>('value 1', integer);
      const input2 = new TypedParameter<number>('value 2', integer);

      compare = new SystemProcess(
        'Compare',
        'Compare two integers',
        null,
        inputs => {
          const value1 = inputs.get(input1);
          const value2 = inputs.get(input2);

          const result = value1 < value2 ? 'less' : value1 > value2 ? 'greater' : 'equal';

          return Promise.resolve({
            returnPath: result,
            outputs: null,
          });
        },
        [input1, input2],
        [],
        ['less', 'greater', 'equal'],
      );

      this.compare = async (in1, in2) => {
        const inputs = new ValueSet();

        inputs.set(input1, in1);
        inputs.set(input2, in2);

        const { returnPath } = await compare.run(inputs);

        return Promise.resolve(returnPath as 'less' | 'greater' | 'equal');
      };
    }

    let modifyNumber: RequiredProcess;

    {
      const input = new TypedParameter<number>('value', integer);
      const output = new TypedParameter<number>('result', integer);

      modifyNumber = new RequiredProcess(
        'Modify number',
        'Perform some operation(s) on a number',
        null,
        [input],
        [output],
        [],
      );

      this.modifyNumber = async in1 => {
        const inputs = new ValueSet();

        inputs.set(input, in1);

        const { outputs } = await modifyNumber.start(inputs);

        return Promise.resolve(outputs!.get(output));
      };
    }

    this.types = [integer];
    this.systemProcesses = [add, subtract, multiply, compare];
    this.requiredProcesses = [modifyNumber];
  }

  public add: (in1: number, in2: number) => Promise<number>;
  public subtract: (in1: number, in2: number) => Promise<number>;
  public multiply: (in1: number, in2: number) => Promise<number>;
  public compare: (in1: number, in2: number) => Promise<'less' | 'greater' | 'equal'>;
  public modifyNumber: (in1: number) => Promise<number>;
}
