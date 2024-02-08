const express = require("express");
var cors = require("cors");

const nodemailer = require("nodemailer");

const app = express();
app.use(cors());

//middleware for parsing JSON in request body
app.use(express.json());

const upload = require("./middleware/uploadFile");
const { ERROR } = require("./utils/httpStatusText");

app.post("/send", upload.array("images", 8), (request, response) => {
  let {
    fullName,
    phone,
    email,
    products,
    services,
    newService,
    region,
    city,
    locationDetails,
  } = request.body;

  if (products) {
    if (typeof products === "string") {
      let productsUpdated = [];
      productsUpdated.push(products);
      products = productsUpdated.map((product) => JSON.parse(product));
    } else if (Array.isArray(products)) {
      const parsedProducts = products.map((product) => JSON.parse(product));
      products = parsedProducts;
    }
  }
  if (services) {
    if (typeof services === "string") {
      let servicesUpdated = [];
      servicesUpdated.push(services);
      services = servicesUpdated.map((service) => JSON.parse(service));
    } else if (Array.isArray(services)) {
      parsedServices = services.map((service) => JSON.parse(service));
      services = parsedServices;
    }
  }

  const files = request.files;

  const isServicesAndNewService =
    services &&
    newService &&
    `
  <div style="display: flex; gap: 10px;">
    <span style="font-size: 16px; color: black;"> نوع البناء الذي اختاره المستخدم :- </span>
  </div>
  <div style="overflow-x: auto;">
    <table style="border-collapse: collapse; width: 100%; font-size: 18px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center; color: black;">
            نوع البناء
          </th>
        </tr>
      </thead>
      <tbody>
        ${services
          ?.map(
            (service) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; color: green;">${service.name}</td>
      </tr>
    `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div style="display: flex; gap: 10px;">
    <span style="font-size: 16px; color: black;"> لقد أضاف المستخدم نوع بناء جديد وهو :- </span>
    <span style="font-size: 16px; color: green; font-weight: 600;">${newService}</span>
  </div>
`;

  const isServicesOnly =
    services &&
    !newService &&
    `
<div style="display: flex; gap: 10px;">
  <span style="font-size: 16px; color: black;"> نوع البناء الذي اختاره المستخدم :- </span>
</div>
<div style="overflow-x: auto;">
  <table style="border-collapse: collapse; width: 100%; font-size: 18px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center; color: black;">
          نوع البناء
        </th>
      </tr>
    </thead>
    <tbody>
      ${services
        ?.map(
          (service) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; color: green;">${service.name}</td>
    </tr>
  `
        )
        .join("")}
    </tbody>
  </table>
</div>
`;

  const isNewServiceOnly =
    !services &&
    newService &&
    `
<div style="display: flex; gap: 10px;">
  <span style="font-size: 16px; color: black;"> لقد أضاف المستخدم نوع بناء جديد ولم يختر نوع بناء من المقترح وهو :- </span>
  <span style="font-size: 16px; color: green; font-weight: 600;"> ${newService} </span>
</div>
`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "mansourmahmoud9999@gmail.com",
      pass: "twgzuhqfivzgtkqv",
    },
  });
  // alkaseralamni@gmail.com
  const mail_option = {
    from: request.body.email || "alkaser@gmail.com",
    to: "mansourmahmoud77a@gmail.com",
    subject: "عرض اسعار",
    text: "عرض اسعار", // plain text body
    html: `
      <div  dir="rtl">

          <div style="display: flex; gap: 10px;">
            <span style="font-size: 16px; color: black;"> الإسم :- </span>
            <span style="font-size: 16px; color: green; font-weight: 600;">${fullName}</span>
           </div>

          <div style="display: flex; gap: 10px;">
            <span style="font-size: 16px; color: black;"> رقم الجوال :- </span>
            <span style="font-size: 16px; color: green; font-weight: 600;">${phone}</span>
          </div>

        <div style="display: flex; gap: 10px;">
          <span style="font-size: 16px; color: black;"> الإيميل  :- </span>
          <span style="font-size: 16px; color: green; font-weight: 600;">${email}</span>
        </div>

        <div style="display: flex; gap: 10px;">
          <span style="font-size: 16px; color: black;"> المنتجات التي اختارها المستخدم  :- </span>
        </div>
        <div style="overflow-x: auto;">
        <table style="border-collapse: collapse; width: 100%; font-size: 18px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; color: black;">المنتج</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center; color: black;">العدد</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; color: green;">${product.productName}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: green;">${product.num}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      ${isServicesAndNewService ? isServicesAndNewService : `<span></span>`}

      ${isServicesOnly ? isServicesOnly : `<span></span>`}

      ${isNewServiceOnly ? isNewServiceOnly : `<span></span>`}


        <div style="display: flex; gap: 10px;">
          <span style="font-size: 16px; color: black;"> المنطقة :- </span>
          <span style="font-size: 16px; color: green; font-weight: 600;">${region}</span>
        </div>

        <div style="display: flex; gap: 10px;">
          <span style="font-size: 16px; color: black;"> المدينة :- </span>
          <span style="font-size: 16px; color: green; font-weight: 600;">${city}</span>
        </div>

        <div style="display: flex; gap: 10px;">
          <span style="font-size: 16px; color: black;"> تفاصيل العنوان (اللوكيشن) :- </span>
          <span style="font-size: 16px; color: green; font-weight: 600;">${locationDetails}</span>
        </div>

      </div>

      `,
    attachments: files?.map((file, index) => ({
      filename: `image_${index + 1}.jpg`, // اسم الملف المرفوع
      content: file.buffer, // المحتوى الخاص بالملف
      encoding: "base64", // الترميز
    })),
  };

  transporter.sendMail(mail_option, (error, info) => {
    if (error) {
      return response
        .status(400)
        .json({ message: "فشل ارسال الرسالة.. رجاء حاول مرة أخري" });
    } else {
      console.log("Email sent:", info);
      // Send a success response or redirect the client
      return response.status(200).json({
        success: true,
        message:
          "تم ارسال رسالتك بنجاح. سيتم الرد عليك في اقرب وقت ممكن. شكرا لك!",
      });
      // response.redirect("/success");
    }
  });
});

app.get("/success", (request, response) => {
  response.send(
    "<h1>تم ارسال رسالتك بنجاح. سيتم الرد عليك في اقرب وقت ممكن. شكرا لك!</h1>"
  );
});

// global middleware for not found router
app.all("*", (req, res) => {
  return res
    .status(404)
    .json({ status: ERROR, message: "this resource is not available" });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.code || 400).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.code || 400,
  });
});

//start server
app.listen(3001, () => {
  console.log("Server started on port 3001");
});
