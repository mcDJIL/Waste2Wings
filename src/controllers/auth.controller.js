const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/ApiError');
const prisma = require('../prismaClient');
const { ROLES } = require('../utils/status');

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  );
}

async function createRoleProfile(tx, user, profile) {
  if (user.role === ROLES.COMMUNITY) {
    return tx.communityProfile.create({
      data: {
        userId: user.id,
        category: profile.category,
        address: profile.address,
        latitude: profile.latitude,
        longitude: profile.longitude,
      },
    });
  }

  if (user.role === ROLES.COLLECTOR) {
    return tx.collectorProfile.create({
      data: {
        userId: user.id,
        companyName: profile.companyName,
        address: profile.address,
        latitude: profile.latitude,
        longitude: profile.longitude,
        capacityLiter: profile.capacityLiter,
        buyPricePerLiter: profile.buyPricePerLiter || 0,
      },
    });
  }

  return tx.stakeholderProfile.create({
    data: {
      userId: user.id,
      companyName: profile.companyName,
      address: profile.address,
    },
  });
}

async function register(req, res, next) {
  try {
    const { body } = req.validated;
    const existingUser = await prisma.user.findUnique({ where: { email: body.email } });

    if (existingUser) {
      throw new ApiError(409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: body.name,
          email: body.email,
          passwordHash,
          role: body.role,
          phone: body.phone,
        },
      });

      await createRoleProfile(tx, createdUser, body.profile);
      return createdUser;
    });

    res.status(201).json({
      user: sanitizeUser(user),
      token: signToken(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { body } = req.validated;
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    res.json({
      user: sanitizeUser(user),
      token: signToken(user),
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

async function logout(req, res) {
  res.json({
    message: 'Logout successful. Please remove the token from client storage.',
  })
}

module.exports = { login, me, register, logout };
