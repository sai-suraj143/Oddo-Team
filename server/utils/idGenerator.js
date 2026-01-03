
const generateEmployeeId = (fullName) => {
    const cleanName = fullName.toUpperCase().replace(/[^A-Z\s]/g, '');
    const names = cleanName.split(' ').filter(n => n.length > 0);

    let initials = 'XXXX';
    if (names.length >= 2) {
        // First 2 letters of First Name + First 2 letters of Last Name
        initials = (names[0].slice(0, 2) + names[names.length - 1].slice(0, 2)).padEnd(4, 'X');
    } else if (names.length === 1) {
        initials = names[0].slice(0, 4).padEnd(4, 'X');
    }

    const year = new Date().getFullYear();
    const serial = Math.floor(1000 + Math.random() * 9000);

    return `OI${initials}${year}${serial}`;
};

module.exports = { generateEmployeeId };
