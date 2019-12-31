import { createFunctionVersionDetector } from 'src/version-detection/FunctionProviderVersionDetector'

it('works', async () => {
    const myProvider = async () => '123'

    const sut = createFunctionVersionDetector(myProvider)

    const ver = await sut.getVersion()

    expect(ver).toBe('123')
})
