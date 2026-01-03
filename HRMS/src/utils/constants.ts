export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Format: OI (2 chars) + Initials (4 chars) + Year (4 chars) + Serial (4 chars) = 14 chars total
export const EMP_ID_REGEX = /^OI[A-Z]{4}\d{8}$/;

export interface UserType {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'HR' | 'Employee';
}

export const MOCK_DB_USERS: UserType[] = [
  { id: 'OIALAD20220001', name: 'Alice Admin', email: 'admin@company.com', password: 'Password@123', role: 'HR' },
  { id: 'OIBOWO20230042', name: 'Bob Worker', email: 'employee@company.com', password: 'Password@123', role: 'Employee' }
];

// --- THIS IS THE MISSING FUNCTION CAUSING THE ERROR ---
export const generateEmployeeId = (fullName: string): string => {
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