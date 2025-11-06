import React from "react";

export default function SingleFormAuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<img src="/logo.svg" alt="" width={132} height={70} className="mb-8" />
			{children}
		</>
	);
}
