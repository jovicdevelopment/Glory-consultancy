// Client-side validation only. Connect to a form service/backend before launch.
const form = $("#cf");

if (form) {
  const params = new URLSearchParams(location.search);

  if (params.get("area")) {
    form.area.value = params.get("area");
  }

  if (params.get("subject")) {
    form.subject.value = params.get("subject");
  }

  const validationMessages = {
    name: "Enter your full name.",
    email: "Enter a valid email address, e.g. you@example.com.",
    area: "Select an area of interest.",
    subject: "Tell us what you'd like to discuss.",
    message: "Add a short message (at least 10 characters).",
    agree: "Please agree before sending.",
  };

  const isInvalid = (fieldName) => {
    const field = form[fieldName];
    const value = field.type === "checkbox" ? field.checked : field.value.trim();

    if (fieldName === "email") {
      return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (fieldName === "message") {
      return value.length < 10;
    }

    return !value;
  };

  const showError = (fieldName) => {
    const field = form[fieldName];
    const hasError = isInvalid(fieldName);
    const errorMessage = $("#e-" + fieldName);

    field.setAttribute("aria-invalid", String(hasError));
    errorMessage.textContent = hasError ? validationMessages[fieldName] : "";

    return hasError;
  };

  Object.keys(validationMessages).forEach((fieldName) => {
    form[fieldName].addEventListener("blur", () => showError(fieldName));
  });

  form.onsubmit = (event) => {
    event.preventDefault();

    const firstInvalidField = Object.keys(validationMessages).find((fieldName) => showError(fieldName));

    if (firstInvalidField) {
      form[firstInvalidField].focus();
      return;
    }

    form.reset();
    $("#ok").hidden = false;
    $("#ok").focus();
  };
}

