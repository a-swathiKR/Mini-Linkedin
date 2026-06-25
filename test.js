const bcrypt = require("bcrypt");

async function test() {
    const pass = "123456";
    let hashedPass = await bcrypt.hash(pass, 10);

    console.log("original password : ", pass);
    console.log("hashed password: ", hashedPass);


    console.log(await bcrypt.compare(pass, hashedPass));
}

test();