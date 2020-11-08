
describe('Numbers converter', () => {
    it('should have the right title', async () => {
        await browser.url('/');

        let title = await browser.getTitle();
        
        expect(title).toBe("Number to text converter")
    })
})