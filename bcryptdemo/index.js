const bcrypt=require('bcrypt');

const hashFunction =async (pw)=>{
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(pw,salt);
    console.log(salt)
    console.log(hash)
}
hashFunction('qwerty')