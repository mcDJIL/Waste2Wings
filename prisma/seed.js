const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PASSWORD = 'password123';

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function addMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

function makePhone(prefix, index) {
  return `${prefix}${String(index).padStart(8, '0')}`;
}

async function cleanDemoData() {
  await prisma.auditLog.deleteMany({});
  await prisma.labResult.deleteMany({});
  await prisma.batchItem.deleteMany({});
  await prisma.collectorBatch.deleteMany({});
  await prisma.communitySubmission.deleteMany({});
  await prisma.stakeholderSetting.deleteMany({});
  await prisma.communityProfile.deleteMany({ where: { user: { email: { endsWith: '@hen.test' } } } });
  await prisma.collectorProfile.deleteMany({ where: { user: { email: { endsWith: '@hen.test' } } } });
  await prisma.stakeholderProfile.deleteMany({ where: { user: { email: { endsWith: '@hen.test' } } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: '@hen.test' } } });
}

async function createUser({ name, email, role, phone }) {
  return prisma.user.create({
    data: {
      name,
      email,
      role,
      phone,
      passwordHash: await bcrypt.hash(PASSWORD, 10),
    },
  });
}

async function createSubmission({
  communityProfileId,
  collectorProfileId,
  estimatedLiter,
  status,
  actualLiter,
  sedimentLiter,
  pricePerLiter,
  collectorNote,
  createdAt,
}) {
  const isValidated = actualLiter !== undefined && sedimentLiter !== undefined && pricePerLiter !== undefined;
  const cleanLiter = isValidated ? actualLiter - sedimentLiter : null;

  return prisma.communitySubmission.create({
    data: {
      communityProfileId,
      collectorProfileId,
      estimatedLiter,
      status,
      actualLiter: isValidated ? actualLiter : null,
      sedimentLiter: isValidated ? sedimentLiter : null,
      cleanLiter,
      pricePerLiter: isValidated ? pricePerLiter : null,
      totalPaid: isValidated ? cleanLiter * pricePerLiter : null,
      collectorNote,
      createdAt,
    },
  });
}

async function createBatchWithItems({
  collectorProfileId,
  stakeholderSettingId,
  batchCode,
  submissions,
  requestedPricePerLiter,
  status,
  finalLiter,
  stakeholderNote,
  createdAt,
}) {
  const totalCleanLiter = submissions.reduce((total, submission) => total + (submission.cleanLiter || 0), 0);
  const resolvedFinalLiter = finalLiter ?? null;

  return prisma.collectorBatch.create({
    data: {
      collectorProfileId,
      stakeholderSettingId,
      batchCode,
      totalCleanLiter,
      requestedPricePerLiter,
      estimatedTotalPrice: totalCleanLiter * requestedPricePerLiter,
      status,
      finalLiter: resolvedFinalLiter,
      finalTotalPrice: resolvedFinalLiter ? resolvedFinalLiter * requestedPricePerLiter : null,
      stakeholderNote,
      createdAt,
      items: {
        create: submissions.map((submission) => ({
          submissionId: submission.id,
          cleanLiterAllocated: submission.cleanLiter || 0,
          createdAt,
        })),
      },
    },
  });
}

async function createLabResult({ batchId, testedById, grade, notes, createdAt, water, ffa, impurity }) {
  return prisma.labResult.create({
    data: {
      batchId,
      testedById,
      waterContentPercent: water,
      ffaPercent: ffa,
      impurityPercent: impurity,
      grade,
      notes,
      createdAt,
    },
  });
}

async function createAuditLog({ actorId, entityType, entityId, action, before, after, reason, createdAt }) {
  return prisma.auditLog.create({
    data: {
      actorId,
      entityType,
      entityId,
      action,
      before,
      after,
      reason,
      ipAddress: '127.0.0.1',
      userAgent: 'seed-script',
      createdAt,
    },
  });
}

async function main() {
  await cleanDemoData();

  const stakeholderUsers = [];
  for (const data of [
    { name: 'HEN Admin', email: 'stakeholder@hen.test', phone: '081100000001' },
    { name: 'HEN Lab Officer', email: 'stakeholder2@hen.test', phone: '081100000002' },
    { name: 'HEN Operations Lead', email: 'stakeholder3@hen.test', phone: '081100000003' },
  ]) {
    stakeholderUsers.push(await createUser({ ...data, role: 'STAKEHOLDER' }));
  }

  await Promise.all(
    stakeholderUsers.map((user, index) =>
      prisma.stakeholderProfile.create({
        data: {
          userId: user.id,
          companyName: index === 1 ? 'PT Hijau Energi Nusantara - Lab' : 'PT Hijau Energi Nusantara',
          address: 'Jakarta',
        },
      }),
    ),
  );

  const setting = await prisma.stakeholderSetting.create({
    data: {
      referencePricePerLiter: 13000,
      receptionLocationName: 'HEN Jakarta Reception Plant',
      receptionAddress: 'Kawasan Industri Pulogadung, Jakarta',
      latitude: -6.1917,
      longitude: 106.8926,
      updatedById: stakeholderUsers[0].id,
      createdAt: addMonths(-12),
    },
  });

  await createAuditLog({
    actorId: stakeholderUsers[0].id,
    entityType: 'STAKEHOLDER_SETTING',
    entityId: setting.id,
    action: 'CREATE',
    before: null,
    after: setting,
    reason: 'Initial demo stakeholder reference price and reception location.',
    createdAt: setting.createdAt,
  });

  const collectorSeeds = [
    ['Pengepul Hijau Tebet', 'Tebet, Jakarta Selatan', -6.2327, 106.8472, 1800, 10600],
    ['Pengepul Bersih Bekasi', 'Bekasi Barat', -6.2383, 106.9756, 2200, 10400],
    ['Pengepul SAF Depok', 'Margonda, Depok', -6.3728, 106.8346, 2000, 10300],
    ['Pengepul Cakung Energi', 'Cakung, Jakarta Timur', -6.1829, 106.9397, 2600, 10500],
    ['Pengepul Tangerang Biofuel', 'Cipondoh, Tangerang', -6.1865, 106.6822, 2400, 10200],
    ['Pengepul Bogor Utara', 'Bogor Utara', -6.5585, 106.8061, 2100, 10100],
  ];

  const collectorUsers = [];
  const collectors = [];
  for (let i = 0; i < collectorSeeds.length; i += 1) {
    const [companyName, address, latitude, longitude, capacityLiter, buyPricePerLiter] = collectorSeeds[i];
    const user = await createUser({
      name: companyName,
      email: `collector${i + 1}@hen.test`,
      role: 'COLLECTOR',
      phone: makePhone('0822', i + 1),
    });
    collectorUsers.push(user);
    collectors.push(
      await prisma.collectorProfile.create({
        data: {
          userId: user.id,
          companyName,
          address,
          latitude,
          longitude,
          capacityLiter,
          buyPricePerLiter,
        },
      }),
    );
  }

  const communitySeeds = [
    ['Ibu Rina', 'HOUSEHOLD', 'Pancoran, Jakarta Selatan', -6.2458, 106.8456],
    ['Warung Pak Budi', 'UMKM', 'Mampang, Jakarta Selatan', -6.2501, 106.8242],
    ['Hotel Melati', 'HOTEL_RESTAURANT', 'Kuningan, Jakarta Selatan', -6.2247, 106.8307],
    ['Kantin Kampus HEN', 'UMKM', 'Rawamangun, Jakarta Timur', -6.1932, 106.8912],
    ['Restoran Nusantara', 'HOTEL_RESTAURANT', 'Bekasi Barat', -6.2399, 106.9923],
    ['UMKM Keripik Jaya', 'INDUSTRY', 'Depok', -6.4025, 106.7942],
    ['Dapur Bu Sari', 'HOUSEHOLD', 'Cawang, Jakarta Timur', -6.2506, 106.8731],
    ['Ayam Goreng Maju', 'UMKM', 'Jatinegara, Jakarta Timur', -6.2146, 106.8702],
    ['Hotel Anggrek', 'HOTEL_RESTAURANT', 'Menteng, Jakarta Pusat', -6.1944, 106.8326],
    ['Pabrik Snack Sinar', 'INDUSTRY', 'Cikarang Barat', -6.2909, 107.0821],
    ['Rumah Makan Padang Raya', 'HOTEL_RESTAURANT', 'Kalimalang, Bekasi', -6.2508, 106.9678],
    ['Kafe Senja', 'UMKM', 'Kemang, Jakarta Selatan', -6.2607, 106.8114],
    ['Dapur Kolektif Cipete', 'UMKM', 'Cipete, Jakarta Selatan', -6.2716, 106.8031],
    ['Hotel Permata Bekasi', 'HOTEL_RESTAURANT', 'Bekasi Timur', -6.2492, 107.0187],
    ['Keripik Mantap Depok', 'UMKM', 'Beji, Depok', -6.3688, 106.8243],
    ['Catering Ibu Dewi', 'UMKM', 'Cinere, Depok', -6.3316, 106.7837],
    ['Restoran Laut Biru', 'HOTEL_RESTAURANT', 'Tangerang Kota', -6.1783, 106.6319],
    ['Dapur Rumah Hijau', 'HOUSEHOLD', 'Ciledug, Tangerang', -6.2361, 106.7174],
    ['Pabrik Kerupuk Bogor', 'INDUSTRY', 'Bogor Utara', -6.5608, 106.8072],
    ['Kantin Pabrik Sentul', 'UMKM', 'Sentul, Bogor', -6.5622, 106.8529],
    ['Hotel Cempaka', 'HOTEL_RESTAURANT', 'Grogol, Jakarta Barat', -6.1667, 106.7905],
    ['Kedai Bakso Lestari', 'UMKM', 'Cengkareng, Jakarta Barat', -6.1512, 106.7351],
    ['Dapur Ayam Geprek', 'UMKM', 'Cakung, Jakarta Timur', -6.1773, 106.9441],
    ['Rumah Tangga Pak Anton', 'HOUSEHOLD', 'Pulo Gadung, Jakarta Timur', -6.1911, 106.8911],
    ['Restoran Keluarga Alam', 'HOTEL_RESTAURANT', 'Bintaro, Tangerang Selatan', -6.2672, 106.7377],
    ['UMKM Pisang Goreng', 'UMKM', 'Sawangan, Depok', -6.4021, 106.7612],
    ['Hotel Surya Bogor', 'HOTEL_RESTAURANT', 'Bogor Tengah', -6.5961, 106.8060],
    ['Pabrik Makanan Ringan', 'INDUSTRY', 'Karawang Barat', -6.3054, 107.3007],
    ['Kantin Sekolah Jaya', 'UMKM', 'Tebet, Jakarta Selatan', -6.2365, 106.8555],
    ['Dapur Nasi Uduk', 'HOUSEHOLD', 'Bekasi Selatan', -6.2700, 106.9801],
  ];

  const communities = [];
  for (let i = 0; i < communitySeeds.length; i += 1) {
    const [name, category, address, latitude, longitude] = communitySeeds[i];
    const user = await createUser({
      name,
      email: `community${i + 1}@hen.test`,
      role: 'COMMUNITY',
      phone: makePhone('0833', i + 1),
    });
    communities.push(
      await prisma.communityProfile.create({
        data: { userId: user.id, category, address, latitude, longitude },
      }),
    );
  }

  const allSubmissions = [];
  const readyForBatch = [];
  const submittedPending = [];
  const rejectedByCollector = [];
  const acceptedBatches = [];
  const rejectedBatches = [];
  const reviewBatches = [];

  for (let monthOffset = -11; monthOffset <= 0; monthOffset += 1) {
    for (let collectorIndex = 0; collectorIndex < collectors.length; collectorIndex += 1) {
      const collector = collectors[collectorIndex];
      const submissions = [];
      for (let itemIndex = 0; itemIndex < 3; itemIndex += 1) {
        const community = communities[(collectorIndex * 5 + itemIndex + monthOffset + 60) % communities.length];
        const estimatedLiter = 22 + ((collectorIndex + itemIndex + monthOffset + 60) % 7) * 8;
        const actualLiter = estimatedLiter - (itemIndex % 2);
        const sedimentLiter = 1 + ((collectorIndex + itemIndex) % 4);
        const createdAt = addMonths(monthOffset);
        createdAt.setDate(5 + itemIndex + collectorIndex);

        const submission = await createSubmission({
          communityProfileId: community.id,
          collectorProfileId: collector.id,
          estimatedLiter,
          status: 'COMPLETED',
          actualLiter,
          sedimentLiter,
          pricePerLiter: collector.buyPricePerLiter,
          collectorNote: 'Setoran diterima dan masuk batch yang diterima HEN.',
          createdAt,
        });
        submissions.push(submission);
        allSubmissions.push(submission);
      }

      const batchDate = addMonths(monthOffset);
      batchDate.setDate(18 + collectorIndex);
      const totalCleanLiter = submissions.reduce((total, submission) => total + submission.cleanLiter, 0);
      const acceptedBatch = await createBatchWithItems({
        collectorProfileId: collector.id,
        stakeholderSettingId: setting.id,
        batchCode: `HEN-BATCH-${batchDate.toISOString().slice(0, 7).replace('-', '')}-${collectorIndex + 1}`,
        submissions,
        requestedPricePerLiter: setting.referencePricePerLiter,
        status: 'ACCEPTED_BY_STAKEHOLDER',
        finalLiter: Math.max(totalCleanLiter - (collectorIndex % 3), 1),
        stakeholderNote: 'Diterima sebagai bahan baku SAF.',
        createdAt: batchDate,
      });
      acceptedBatches.push(acceptedBatch);

      await createLabResult({
        batchId: acceptedBatch.id,
        testedById: stakeholderUsers[collectorIndex % stakeholderUsers.length].id,
        grade: collectorIndex % 2 === 0 ? 'A' : 'B',
        notes: 'Batch memenuhi standar mutu HEN.',
        water: 0.4 + (collectorIndex % 3) * 0.2,
        ffa: 1.4 + (collectorIndex % 4) * 0.3,
        impurity: 0.2 + (collectorIndex % 3) * 0.2,
        createdAt: batchDate,
      });
    }
  }

  for (let i = 0; i < 18; i += 1) {
    const collector = collectors[i % collectors.length];
    const community = communities[(i * 2) % communities.length];
    const submission = await createSubmission({
      communityProfileId: community.id,
      collectorProfileId: collector.id,
      estimatedLiter: 20 + (i % 8) * 5,
      status: 'ACCEPTED_BY_COLLECTOR',
      actualLiter: 19 + (i % 8) * 5,
      sedimentLiter: 1 + (i % 3),
      pricePerLiter: collector.buyPricePerLiter,
      collectorNote: 'Siap dimasukkan ke batch berikutnya.',
      createdAt: addDays(-i - 1),
    });
    readyForBatch.push(submission);
    allSubmissions.push(submission);
  }

  for (let i = 0; i < 24; i += 1) {
    const submission = await prisma.communitySubmission.create({
      data: {
        communityProfileId: communities[(i + 3) % communities.length].id,
        collectorProfileId: collectors[i % collectors.length].id,
        estimatedLiter: 12 + (i % 9) * 4,
        status: 'SUBMITTED',
        createdAt: addDays(-i),
      },
    });
    submittedPending.push(submission);
    allSubmissions.push(submission);
  }

  for (let i = 0; i < 16; i += 1) {
    const submission = await prisma.communitySubmission.create({
      data: {
        communityProfileId: communities[(i + 8) % communities.length].id,
        collectorProfileId: collectors[i % collectors.length].id,
        estimatedLiter: 18 + (i % 6) * 6,
        status: 'REJECTED_BY_COLLECTOR',
        collectorNote: 'Ditolak karena kualitas awal tidak memenuhi standar pengepul.',
        createdAt: addDays(-20 - i),
      },
    });
    rejectedByCollector.push(submission);
    allSubmissions.push(submission);
  }

  for (let batchIndex = 0; batchIndex < 4; batchIndex += 1) {
    const collector = collectors[batchIndex];
    const submissions = [];
    for (let itemIndex = 0; itemIndex < 3; itemIndex += 1) {
      const submission = await createSubmission({
        communityProfileId: communities[(batchIndex * 4 + itemIndex) % communities.length].id,
        collectorProfileId: collector.id,
        estimatedLiter: 34 + itemIndex * 7,
        status: 'IN_BATCH',
        actualLiter: 33 + itemIndex * 7,
        sedimentLiter: 2 + itemIndex,
        pricePerLiter: collector.buyPricePerLiter,
        collectorNote: 'Masuk batch lab review.',
        createdAt: addDays(-6 - batchIndex - itemIndex),
      });
      submissions.push(submission);
      allSubmissions.push(submission);
    }

    const reviewBatch = await createBatchWithItems({
      collectorProfileId: collector.id,
      stakeholderSettingId: setting.id,
      batchCode: `HEN-BATCH-DEMO-REVIEW-${batchIndex + 1}`,
      submissions,
      requestedPricePerLiter: setting.referencePricePerLiter,
      status: 'LAB_REVIEW',
      stakeholderNote: 'Menunggu keputusan final stakeholder.',
      createdAt: addDays(-3 - batchIndex),
    });
    reviewBatches.push(reviewBatch);

    await createLabResult({
      batchId: reviewBatch.id,
      testedById: stakeholderUsers[(batchIndex + 1) % stakeholderUsers.length].id,
      grade: batchIndex % 2 === 0 ? 'B' : 'C',
      notes: 'Hasil lab tersedia, menunggu validasi final.',
      water: 0.9 + batchIndex * 0.3,
      ffa: 2.1 + batchIndex * 0.4,
      impurity: 0.6 + batchIndex * 0.5,
      createdAt: addDays(-2 - batchIndex),
    });
  }

  for (let batchIndex = 0; batchIndex < 3; batchIndex += 1) {
    const collector = collectors[(batchIndex + 3) % collectors.length];
    const submissions = [];
    for (let itemIndex = 0; itemIndex < 2; itemIndex += 1) {
      const submission = await createSubmission({
        communityProfileId: communities[(batchIndex * 6 + itemIndex + 10) % communities.length].id,
        collectorProfileId: collector.id,
        estimatedLiter: 42 + itemIndex * 9,
        status: 'IN_BATCH',
        actualLiter: 40 + itemIndex * 9,
        sedimentLiter: 5 + itemIndex,
        pricePerLiter: collector.buyPricePerLiter,
        collectorNote: 'Masuk batch yang ditolak stakeholder.',
        createdAt: addDays(-18 - batchIndex - itemIndex),
      });
      submissions.push(submission);
      allSubmissions.push(submission);
    }

    const rejectedBatch = await createBatchWithItems({
      collectorProfileId: collector.id,
      stakeholderSettingId: setting.id,
      batchCode: `HEN-BATCH-DEMO-REJECTED-${batchIndex + 1}`,
      submissions,
      requestedPricePerLiter: setting.referencePricePerLiter,
      status: 'REJECTED_BY_STAKEHOLDER',
      stakeholderNote: 'Ditolak karena parameter lab melewati ambang batas.',
      createdAt: addDays(-14 - batchIndex),
    });
    rejectedBatches.push(rejectedBatch);

    await createLabResult({
      batchId: rejectedBatch.id,
      testedById: stakeholderUsers[1].id,
      grade: 'REJECT',
      notes: 'Tidak memenuhi standar mutu HEN.',
      water: 2.5 + batchIndex * 0.3,
      ffa: 5.0 + batchIndex * 0.5,
      impurity: 4.0 + batchIndex * 0.4,
      createdAt: addDays(-13 - batchIndex),
    });
  }

  for (let i = 0; i < Math.min(30, allSubmissions.length); i += 1) {
    const submission = allSubmissions[i];
    await createAuditLog({
      actorId: collectorUsers[i % collectorUsers.length].id,
      entityType: 'COMMUNITY_SUBMISSION',
      entityId: submission.id,
      action: submission.status === 'REJECTED_BY_COLLECTOR' ? 'REJECT' : 'ACCEPT',
      before: { status: 'SUBMITTED' },
      after: { status: submission.status, cleanLiter: submission.cleanLiter, totalPaid: submission.totalPaid },
      reason: submission.collectorNote || 'Demo validation audit log.',
      createdAt: submission.updatedAt,
    });
  }

  for (const batch of [...acceptedBatches.slice(-10), ...reviewBatches, ...rejectedBatches]) {
    await createAuditLog({
      actorId: stakeholderUsers[0].id,
      entityType: 'COLLECTOR_BATCH',
      entityId: batch.id,
      action: batch.status === 'REJECTED_BY_STAKEHOLDER' ? 'REJECT' : 'FINAL_VALIDATE',
      before: { status: 'LAB_REVIEW' },
      after: { status: batch.status, finalLiter: batch.finalLiter, finalTotalPrice: batch.finalTotalPrice },
      reason: batch.stakeholderNote || 'Demo batch audit log.',
      createdAt: batch.updatedAt,
    });
  }

  console.log('Seed completed. Demo accounts password:', PASSWORD);
  console.log(`Stakeholders: ${stakeholderUsers.length}`);
  console.log(`Collectors: ${collectors.length}`);
  console.log(`Communities: ${communities.length}`);
  console.log(`Submissions: ${allSubmissions.length}`);
  console.log(`Accepted batches: ${acceptedBatches.length}`);
  console.log(`Lab review batches: ${reviewBatches.length}`);
  console.log(`Rejected batches: ${rejectedBatches.length}`);
  console.log('Main accounts: stakeholder@hen.test, collector1@hen.test, community1@hen.test');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
