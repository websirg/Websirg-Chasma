// Automated Verification of Bhardwaj Chasma Ghar System Core Engine
const fs = require('fs');
const path = require('path');

// 1. Mock Browser Environment
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};
global.document = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => []
};
global.window = global;

// 2. Load store.js
const storeCode = fs.readFileSync(path.join(__dirname, 'js/store.js'), 'utf8');
eval(storeCode);

console.log('--- RUNNING BCG SYSTEM VERIFICATION SUITE ---\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
  }
}

// TEST 1: Business Settings
const settings = BCGStore.getSettings();
assert(settings.name === 'Bhardwaj Chasma Ghar', 'Business Name is Bhardwaj Chasma Ghar');
assert(settings.address === 'Itaily Moad, Maudha Road, Mehnajpur, Azamgarh', 'Address is Mehnajpur, Azamgarh');
assert(settings.doctorName === 'Dr. Satya Prakash Bhardwaj', 'Doctor is Dr. Satya Prakash Bhardwaj');

// TEST 2: Frame Inventory Stock
const initialFrames = BCGStore.getDB().frames;
assert(initialFrames.length > 0, `Initial frame inventory loaded: ${initialFrames.length} items`);
const testFrame = initialFrames[0];
const initialStock = testFrame.stock;

// TEST 3: Journey A - Normal Customer Cart & Order Request
BCGCart.clear();
assert(BCGCart.getItems().length === 0, 'Cart is empty initially');
BCGCart.addItem(testFrame, 1);
assert(BCGCart.getItems().length === 1, 'Frame added to Cart');
assert(BCGCart.getSubtotal() === testFrame.price, `Cart subtotal matches selling price (₹${testFrame.price})`);

// Customer places order request
const orderRequest = BCGStore.createCustomerOrder({
  customerName: 'Amit Verma',
  customerPhone: '9811122233',
  customerEmail: 'amit@example.com',
  shippingAddress: 'Mehnajpur Bazar, Azamgarh',
  items: BCGCart.getItems(),
  notes: 'Online Order via Store'
});

assert(orderRequest && orderRequest.id.startsWith('BCG-ORD-'), `Customer Order Request created: ${orderRequest.id}`);
assert(orderRequest.status === 'Pending Verification', 'Order is in Pending Verification status');
assert(orderRequest.invoiceNumber === null, 'Customer order does NOT have an invoice initially (Invoice rule enforced)');

// TEST 4: Staff Billing & Verification of Normal Order
const staffResult = BCGStore.staffVerifyAndGenerateOrderInvoice(orderRequest.id, {
  discount: 100,
  advance: orderRequest.totalAmount - 100,
  paymentMethod: 'UPI'
});

const staffInvoice = staffResult ? staffResult.invoice : null;
assert(staffInvoice && staffInvoice.id.startsWith('BCG-INV-'), `Staff generated Invoice: ${staffInvoice ? staffInvoice.id : 'NONE'}`);
assert(staffInvoice && staffInvoice.dueAmount === 0, 'Invoice balance due calculated accurately');

// Check order status updated
const updatedOrder = BCGStore.getOrderById(orderRequest.id);
assert(updatedOrder.status === 'Confirmed / Billed', 'Order status updated to Confirmed / Billed');
assert(updatedOrder.invoiceNumber === staffInvoice.id, 'Order linked to official GST invoice');

// Check inventory auto-decrement
const updatedFrame = BCGStore.getDB().frames.find(f => f.id === testFrame.id);
assert(updatedFrame.stock === initialStock - 1, `Frame stock decremented from ${initialStock} to ${updatedFrame.stock}`);

// TEST 5: Journey C - Doctor Eye Examination & "Save & Send to Optical"
const newPatient = BCGStore.addPatient({
  name: 'Suresh Patel',
  phone: '9777888999',
  age: 42,
  gender: 'Male',
  address: 'Mehnajpur Village',
  history: 'Reading blurriness'
});
assert(newPatient && newPatient.id, `New Patient Registered: ${newPatient.name} (${newPatient.id})`);

// Doctor saves exam and sends to optical
const rxResult = BCGStore.addPrescription({
  patientId: newPatient.id,
  patientName: newPatient.name,
  patientPhone: newPatient.phone,
  doctorName: settings.doctorName,
  power: {
    re_sph: '-1.25',
    re_cyl: '-0.50',
    re_axis: '90',
    re_add: '+1.50',
    le_sph: '-1.50',
    le_cyl: '-0.25',
    le_axis: '180',
    le_add: '+1.50',
    pd: '63'
  },
  medicines: [
    { name: 'Carboxymethylcellulose 0.5%', dose: '1 drop', freq: '3 times daily', duration: '15 days', instructions: 'Eye drops' }
  ],
  notes: 'Mild presbyopia with myopic astigmatism. Recommend Blue-cut Progressive lenses.'
}, true); // true = sendToOptical

const rx = rxResult ? rxResult.prescription : null;
assert(rx && rx.id.startsWith('RX-'), `Prescription created: ${rx ? rx.id : 'NONE'}`);
assert(rxResult && rxResult.opticalJobId && rxResult.opticalJobId.startsWith('BCG-OPT-'), `Optical Job auto-linked: ${rxResult.opticalJobId}`);

// Verify Optical Job was automatically generated for Staff
const opticalJobs = BCGStore.getOpticalJobs();
const generatedJob = opticalJobs.find(j => j.prescriptionId === rx.id);
assert(generatedJob !== undefined, `Optical Job automatically created for Staff: ${generatedJob ? generatedJob.id : 'NONE'}`);
assert(generatedJob && generatedJob.status === 'Prescription Received', 'Job status initialized to Prescription Received');

// TEST 6: Staff selects Frame + Lens & Generates Job Invoice
const selectedLens = BCGStore.getDB().lenses[0];

// Staff selects frame and lens
BCGStore.updateOpticalJob(generatedJob.id, {
  frameId: testFrame.id,
  frameName: `${testFrame.brand} ${testFrame.model}`,
  framePrice: testFrame.price,
  lensId: selectedLens.id,
  lensName: `${selectedLens.brand} ${selectedLens.name}`,
  lensPrice: selectedLens.price,
  status: 'Frame Selected',
  note: 'Selected frame and progressive blue-cut lenses.'
});

const jobInvoice = BCGStore.staffGenerateJobInvoice(generatedJob.id, {
  fittingCharge: 150,
  otherCharges: 0,
  discount: 200,
  advance: 1000,
  paymentMethod: 'Cash',
  expectedDelivery: '2026-10-15'
});

assert(jobInvoice && jobInvoice.id.startsWith('BCG-INV-'), `Staff generated Optical Job Invoice: ${jobInvoice ? jobInvoice.id : 'NONE'}`);
const updatedJob = BCGStore.getOpticalJobById(generatedJob.id);
assert(updatedJob.status === 'Frame Selected', 'Optical Job advanced to Frame Selected in production pipeline');
assert(updatedJob.invoiceNumber === jobInvoice.id, 'Optical Job linked to GST invoice');
assert(updatedJob.due > 0, `Optical Job due payment recorded accurately: ₹${updatedJob.due}`);

// Advance Job through 7-stage production pipeline
const pipelineStages = [
  'Lens Processing',
  'Fitting',
  'Quality Check',
  'Ready',
  'Delivered'
];

for (const stage of pipelineStages) {
  BCGStore.updateOpticalJob(updatedJob.id, { status: stage, note: `Stage updated to ${stage}` });
}
const finalJob = BCGStore.getOpticalJobById(updatedJob.id);
assert(finalJob.status === 'Delivered', 'Optical Job successfully transitioned through all 7 stages to Delivered');
assert(finalJob.timeline.length >= 7, `Audit timeline contains ${finalJob.timeline.length} stage log entries`);

// TEST 7: Customer 360 Search
const c360 = BCGStore.getCustomer360('9811122233');
assert(c360 !== null, 'Customer 360 retrieved profile for 9811122233');
assert(c360.orders.length >= 1, `Customer 360 contains ${c360.orders.length} order(s)`);
assert(c360.invoices.length >= 1, `Customer 360 contains ${c360.invoices.length} invoice(s)`);

const patient360 = BCGStore.getCustomer360('9777888999');
assert(patient360 !== null, 'Customer 360 retrieved profile for 9777888999');
assert(patient360.prescriptions.length >= 1, `Customer 360 contains ${patient360.prescriptions.length} prescription(s)`);
assert(patient360.opticalJobs.length >= 1, `Customer 360 contains ${patient360.opticalJobs.length} optical job(s)`);

// TEST 8: Repair Workflow
const repair = BCGStore.addRepair({
  customerName: 'Kavita Singh',
  customerPhone: '9844455566',
  frameDescription: 'Metal Half-Rim Frame',
  problem: 'Right temple screw loose and nose pad missing',
  estimatedCost: 150
});
assert(repair && repair.id.startsWith('REP-'), `Repair Ticket created: ${repair.id}`);
assert(repair.status === 'Received', 'Repair status starts at Received');

BCGStore.updateRepairStatus(repair.id, 'Repairing', 'Fitting replacement silicon pad and new screw');
BCGStore.updateRepairStatus(repair.id, 'Ready', 'Alignment verified on lensometer');
const updatedRepair = BCGStore.getRepairById(repair.id);
assert(updatedRepair.status === 'Ready', 'Repair stage reached Ready');

// TEST 9: Audit Trail
const logs = BCGStore.getDB().audit_logs;
assert(logs.length > 0, `Audit log recorded ${logs.length} operations`);

console.log('\n========================================');
console.log(`TOTAL TESTS PASSED: ${testsPassed}`);
console.log(`TOTAL TESTS FAILED: ${testsFailed}`);
console.log('========================================\n');

if (testsFailed === 0) {
  console.log('🎉 ALL BUSINESS LOGIC AND WORKFLOW TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  process.exit(1);
}
