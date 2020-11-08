
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
    ];

    const others = [
        { num: 1000000, text: "one million" },
        { num: 154011, text: "one hundred and fifty-four thousand and eleven" },
        { num: 1010, text: "one thousand and ten" },
        { num: 1000, text: "one thousand" }
    ]

    acceptance.concat(others).forEach(ac => {        
        
        it(`should display the correct text for ${ac.num}`, async () => {
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