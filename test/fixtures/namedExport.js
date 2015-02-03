if (!window || typeof window !== "object") {
    throw new Error("window is not defined");
}

window.propertyA = true;
window.propertyB = false;
