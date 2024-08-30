
export function formatCurrency(value: number) {
    return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDate(value: Date) {
    return value.toLocaleDateString("en-US");
}

export function formatPhone(value: string) {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return value;
}