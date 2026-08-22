const prisma = require("../prismaClient");

/**
 * Public Traceability Lookup
 * Accepts batchCode, batchId, or submissionId
 * Returns complete 4-step lineage from Community -> Collector -> Lab -> SAF Avtur
 */
async function getTraceabilityByCode(req, res, next) {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: "Traceability code is required" });
    }

    // 1. Try finding as CollectorBatch first (by batchCode or id)
    let batch = await prisma.collectorBatch.findFirst({
      where: {
        OR: [
          { batchCode: { equals: code, mode: 'insensitive' } },
          { id: code },
        ],
      },
      include: {
        collectorProfile: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        stakeholderSetting: true,
        labResult: {
          include: {
            testedBy: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        items: {
          include: {
            submission: {
              include: {
                communityProfile: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true, phone: true },
                    },
                  },
                },
                collectorProfile: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true, phone: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // 2. If not found as batch, try finding as CommunitySubmission (by id)
    if (!batch) {
      const submission = await prisma.communitySubmission.findUnique({
        where: { id: code },
        include: {
          communityProfile: {
            include: {
              user: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          },
          collectorProfile: {
            include: {
              user: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          },
          batchItems: {
            include: {
              batch: {
                include: {
                  collectorProfile: true,
                  labResult: {
                    include: {
                      testedBy: { select: { id: true, name: true, email: true } },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!submission) {
        return res.status(404).json({
          error: "Data traceability tidak ditemukan untuk kode: " + code,
        });
      }

      // If submission exists, construct response centered around this submission
      const parentBatch = submission.batchItems[0]?.batch || null;
      const cleanLiter = submission.cleanLiter || submission.actualLiter || submission.estimatedLiter;
      const co2SavedKg = Number((cleanLiter * 2.85).toFixed(2)); // Standard SAF carbon reduction multiplier

      return res.json({
        traceabilityType: "SUBMISSION",
        code: submission.id,
        status: submission.status,
        totalVolumeLiter: cleanLiter,
        co2SavedKg,
        step1_community: {
          communityName: submission.communityProfile?.user?.name || "Masyarakat",
          category: submission.communityProfile?.category || "HOUSEHOLD",
          address: submission.communityProfile?.address || "-",
          latitude: submission.communityProfile?.latitude || null,
          longitude: submission.communityProfile?.longitude || null,
          estimatedLiter: submission.estimatedLiter,
          createdAt: submission.createdAt,
        },
        step2_collector: {
          collectorName: submission.collectorProfile?.companyName || "Pengepul",
          address: submission.collectorProfile?.address || "-",
          actualLiter: submission.actualLiter,
          sedimentLiter: submission.sedimentLiter,
          cleanLiter: submission.cleanLiter,
          totalPaid: submission.totalPaid,
          collectorNote: submission.collectorNote,
          validatedAt: submission.updatedAt,
        },
        step3_labResult: parentBatch?.labResult ? {
          batchCode: parentBatch.batchCode,
          waterContentPercent: parentBatch.labResult.waterContentPercent,
          ffaPercent: parentBatch.labResult.ffaPercent,
          impurityPercent: parentBatch.labResult.impurityPercent,
          grade: parentBatch.labResult.grade,
          notes: parentBatch.labResult.notes,
          testedByName: parentBatch.labResult.testedBy?.name || "Refinery Lab",
          testedAt: parentBatch.labResult.createdAt,
        } : null,
        step4_safProduction: parentBatch?.status === "ACCEPTED_BY_STAKEHOLDER" ? {
          status: "READY_FOR_SAF_REFINING",
          product: "Sustainable Aviation Fuel (SAF / Bio-Avtur)",
          estAvturOutputLiter: Number((cleanLiter * 0.88).toFixed(2)),
          co2OffsetKg: co2SavedKg,
          complianceStandard: "ISCC CORSIA Certified",
        } : null,
      });
    }

    // Calculate aggregate metrics for the batch
    const totalVolume = batch.finalLiter || batch.totalCleanLiter;
    const co2SavedKg = Number((totalVolume * 2.85).toFixed(2));
    const safOutputLiter = Number((totalVolume * 0.88).toFixed(2));

    const submissionsList = batch.items.map((item) => ({
      submissionId: item.submission.id,
      communityName: item.submission.communityProfile?.user?.name || "Komunitas",
      category: item.submission.communityProfile?.category,
      address: item.submission.communityProfile?.address,
      latitude: item.submission.communityProfile?.latitude,
      longitude: item.submission.communityProfile?.longitude,
      estimatedLiter: item.submission.estimatedLiter,
      cleanLiter: item.submission.cleanLiter,
      createdAt: item.submission.createdAt,
    }));

    return res.json({
      traceabilityType: "BATCH",
      code: batch.batchCode,
      batchId: batch.id,
      status: batch.status,
      totalVolumeLiter: totalVolume,
      co2SavedKg,
      step1_communitySubmissions: submissionsList,
      step2_collector: {
        collectorName: batch.collectorProfile?.companyName,
        address: batch.collectorProfile?.address,
        totalCleanLiter: batch.totalCleanLiter,
        requestedPricePerLiter: batch.requestedPricePerLiter,
        estimatedTotalPrice: batch.estimatedTotalPrice,
        finalLiter: batch.finalLiter,
        finalTotalPrice: batch.finalTotalPrice,
        createdAt: batch.createdAt,
      },
      step3_labResult: batch.labResult ? {
        waterContentPercent: batch.labResult.waterContentPercent,
        ffaPercent: batch.labResult.ffaPercent,
        impurityPercent: batch.labResult.impurityPercent,
        grade: batch.labResult.grade,
        notes: batch.labResult.notes,
        testedByName: batch.labResult.testedBy?.name || "Refinery Lab",
        testedAt: batch.labResult.createdAt,
      } : null,
      step4_safProduction: batch.status === "ACCEPTED_BY_STAKEHOLDER" ? {
        status: "PROCESSED_TO_AVTUR",
        product: "Sustainable Aviation Fuel (SAF / Bio-Avtur)",
        avturOutputLiter: safOutputLiter,
        co2OffsetKg: co2SavedKg,
        receptionFacility: batch.stakeholderSetting?.receptionLocationName || "Refinery Terminal",
        complianceStandard: "ISCC CORSIA Certified",
      } : {
        status: "IN_TESTING_OR_REVIEW",
        product: "Raw Used Cooking Oil (UCO)",
      },
    });

  } catch (error) {
    next(error);
  }
}

module.exports = { getTraceabilityByCode };
