import entrypoint from 'src/cli/entrypoint'
import { Context } from 'src/cli/Context'

export const expectCliInvoked = (
    command: string,
    ctx: Context,
    mock: jest.Mock,
    args: any[]
) => {
    entrypoint(ctx).parse(command)

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith(...args)

    mock.mockClear()
}
