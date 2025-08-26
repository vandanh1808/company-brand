export type JobOpening = {
	id: number | string;
	title: string;
	description: string; // mô tả ngắn dưới tiêu đề
	requirements: string; // danh sách yêu cầu (bullet)
	salaryText: string; // “thỏa thuận”, “15–20tr”, …
	quantityText: string; // “1 người”, “2 người”
	location: string; // “TP. Hồ Chí Minh”
	experience: string; // “2-3 năm”
	postedAt: string; // “21/01/2025”
	deadline: string; // “01/09/2025”
};

export const jobOpenings: JobOpening[] = [
	{
		id: 1,
		title: "Kế toán Tổng hợp",
		description:
			"Thực hiện công tác kế toán tổng hợp, lập báo cáo tài chính và quyết toán thuế.",
		requirements: `- Tốt nghiệp Đại học chuyên ngành Kế toán, Tài chính
- Có kinh nghiệm 2-3 năm trong lĩnh vực kế toán
- Thành thạo phần mềm kế toán (MISA, FAST)
- Có chứng chỉ hành nghề kế toán`,
		salaryText: "thỏa thuận",
		quantityText: "1 người",
		location: "TP. Hồ Chí Minh",
		experience: "2-3 năm",
		postedAt: "21/01/2025",
		deadline: "01/09/2025",
	},
	{
		id: 2,
		title: "Nhân viên Nhân sự",
		description:
			"Quản lý hồ sơ nhân sự, hỗ trợ tuyển dụng và thực hiện các thủ tục liên quan đến nhân viên.",
		requirements: `- Tốt nghiệp Cao đẳng/Đại học chuyên ngành Quản trị nhân sự hoặc các ngành liên quan
- Có ít nhất 1 năm kinh nghiệm ở vị trí nhân sự
- Kỹ năng giao tiếp và xử lý tình huống tốt
- Thành thạo tin học văn phòng`,
		salaryText: "12–15 triệu",
		quantityText: "2 người",
		location: "Hà Nội",
		experience: "1-2 năm",
		postedAt: "15/02/2025",
		deadline: "30/09/2025",
	},
];
