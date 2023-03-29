import bcrypt from "bcryptjs";

const users = [
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('admin', 10),
    isAdmin: true,
    phoneNumber: '0123456789',
    address: {
      street: 'Jalan Bukit Bintang',
      city: 'Kuala Lumpur',
      postalCode: '55100',
      country: 'Malaysia'
    }
  },
  {
    name: 'Naim',
    email: 'naim@gmail.com',
    password: bcrypt.hashSync('naim', 10),
    isAdmin: false,
    phoneNumber: '0123456789',
    address: {
      street: 'Jalan Tun Razak',
      city: 'Kuala Lumpur',
      postalCode: '50400',
      country: 'Malaysia'
    }
  },
  {
    name: 'haziq',
    email: 'haziq@gmail.com',
    password: bcrypt.hashSync('haziq', 10),
    isAdmin: false,
    phoneNumber: '0123456789',
    address: {
      street: 'Jalan SS2/75',
      city: 'Petaling Jaya',
      postalCode: '47300',
      country: 'Malaysia'
    }
  }
]

export default users;