console.log('hello world');

var foo = 3;
console.log(foo, typeof foo);

var arr = ['a', 'b'];
console.log(arr, typeof arr);

var info = {
    name: 'Linh',
    age: '21'
};
console.log(info.name, info['age']); //c1
console.log(info['name'], info['age']); //c2


var role = [
    { id: 'ad', roleName: "Admin", Description: "" },
    { id: 'tc', roleName: "Teacher", Description: "" },
    { id: 'st', roleName: "Student", Description: "" }

];

//db.role.insert(role);

var users = [
    {
        id: 'user01',
        first_name: 'Linh',
        last_name: 'Nguyen',
        gender: 'male',
        role: 'st',
        description: ''
    },
    {
        id: 'user02',
        first_name: 'Nghia',
        last_name: 'Tran',
        gender: 'male',
        role: 'tc',
        description: ''
    },
    {
        id: 'user03',
        first_name: 'Hung',
        last_name: 'Nguyen',
        gender: 'male',
        role: 'ad',
        description: ''
    },
];

db.user.insert(users);


