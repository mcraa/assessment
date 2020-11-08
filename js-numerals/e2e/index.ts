
describe('Numbers converter', () => {

    it('should have the right title', async () => {
        await browser.url('/');

        let title = await browser.getTitle();
        
        expect(title).toBe("Number to text converter")
    })

    const acceptance = [
        { num: 7, text: "seven" },
        { num: 42, text: "forty-two" },
        { num: 2001, text: "two thousand and one" },
        { num: 1999, text: "nineteen hundred and ninety-nine" },
        { num: 17999, text: "seventeen thousand nine hundred and ninety-nine" }
    ]

    acceptance.forEach(ac => {        
        
        it(`should display the correct number for ${ac.num}`, async () => {
            await browser.url('/');
            
            let input = await browser.$('#inputtext');
            await input.setValue(ac.num)
            
            let submit = await browser.$("#submit-button");
            await submit.click();
            
            let result = await browser.$("#result")
            let text = await result.getText();
            
            expect(text).toBe(ac.text)
        })
        
    });
})