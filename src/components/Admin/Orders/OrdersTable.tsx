
'use client';

import * as React from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	TableSortLabel,
	Paper,
	IconButton,
} from '@mui/material';
import { AdminOrder, Article } from '@/types/api.types';
import { Check, Edit, Eye, PhoneIcon, Trash, X } from 'lucide-react';
import { toJalaliDateTime } from '@/lib/utils';
import Link from 'next/link';
import { useAppSelector } from '@/hook/useRedux';
import { selectRole } from '@/lib/redux/slices/authSlice';



interface ProductTableProps {
	rows: AdminOrder[];
	setOpenDeleteModal: (id: number) => void;
	setOpenEditModal: (id: number) => void;
}

type Order = 'asc' | 'desc';
type OrderBy = 'total_amount' | 'seen' | 'created_at';

export default function OrdersTable({ rows, setOpenDeleteModal, setOpenEditModal }: ProductTableProps) {
	const [order, setOrder] = React.useState<Order>('asc');
	const [orderBy, setOrderBy] = React.useState<OrderBy>('created_at');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const role = useAppSelector(selectRole);


	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: OrderBy
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const getValue = (row: AdminOrder, key: OrderBy): number | string | boolean => {
		switch (key) {
			case 'total_amount':
				return row.total_amount;
			case 'seen':
				return row.seen;
			case 'created_at':
				return row.created_at ?? '';
			default:
				return '';
		}
	};

	function descendingComparator(a: AdminOrder, b: AdminOrder, orderBy: OrderBy) {
		const aValue = getValue(a, orderBy);
		const bValue = getValue(b, orderBy);
		if (bValue < aValue) return -1;
		if (bValue > aValue) return 1;
		return 0;
	}

	function getComparator(order: Order, orderBy: OrderBy) {
		return order === 'desc'
			? (a: AdminOrder, b: AdminOrder) => descendingComparator(a, b, orderBy)
			: (a: AdminOrder, b: AdminOrder) => -descendingComparator(a, b, orderBy);
	}

	const sortedRows = React.useMemo(() => {
		const comparator: (a: AdminOrder, b: AdminOrder) => number = getComparator(order, orderBy);
		return [...rows]
			.sort((a: AdminOrder, b: AdminOrder) => comparator(a, b))
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	}, [rows, order, orderBy, page, rowsPerPage]);

	const headCells = [
		{ id: 'actions', label: 'عملیات', numeric: false },
		{ id: 'created_at', label: 'تاریخ ثبت', numeric: true },
		{ id: 'total_amount', label: 'مبلغ کل', numeric: false },
		{ id: 'seen', label: 'دیده شده', numeric: true },
		{ id: 'phone', label: 'شماره تماس', numeric: false },

		// { id: 'image', label: 'تصویر', numeric: false },

	];

	return (
		<Box sx={{ width: '100%', fontFamily: 'kalameh !important', fontWeight: 'bold' }} className="text-foreground">
			<Paper sx={{ width: '100%', boxShadow: 'none' }} className="bg-card text-foreground">
				<TableContainer>
					<Table sx={{ width: '100%', minWidth: 500, tableLayout: 'auto' }}>
						<TableHead>
							<TableRow>
								{headCells.map((headCell) => (
									<TableCell
										key={headCell.id}
										align="center"
										sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}
										className="text-foreground"
									>
										{headCell.id !== 'actions' ? (
											<TableSortLabel
												active={orderBy === headCell.id}
												direction={orderBy === headCell.id ? order : 'asc'}
												onClick={(e) => handleRequestSort(e, headCell.id as OrderBy)}
											>
												{headCell.label}
											</TableSortLabel>
										) : (
											headCell.label
										)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{sortedRows.map((row) => (
								<TableRow hover key={row.id} className="text-foreground"  >
									<TableCell align="center">
										{role === 'manager' &&
											<IconButton onClick={() => { setOpenDeleteModal(row.id) }}>
												<Trash className="text-red-600" />
											</IconButton>
										}
										<Link href={`orders/${row.id}`}>
											<IconButton >
												<Eye className="text-blue-600" />
											</IconButton>
										</Link>

									</TableCell>
									<TableCell align="center" className="text-foreground" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{toJalaliDateTime(row.created_at)}</TableCell>
									<TableCell align="center" className="text-foreground max-sm:min-w-50 " dir='ltr' sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}> تومان {(row.total_amount).toLocaleString()} </TableCell>
									<TableCell align="center" className="text-foreground flex justify-center items-center" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{(row.seen) ? <span className='flex justify-center items-center'><Check strokeWidth='5' className='text-green-600' /></span> : <span className='flex justify-center items-center'><X strokeWidth='5' className='text-red-600' /></span>} </TableCell>
									<TableCell align="center" className="text-foreground max-sm:min-w-50 " sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}>{row.phone}</TableCell>
									{/* <TableCell align="center" className="text-foreground max-w-10 max-lg:min-w-50" sx={{ fontFamily: 'kalameh !important', fontWeight: 'bold' }}><img src={row.id} alt='تصویر مقاله' className='rounded-sm aspect-video object-cover h-20 '/></TableCell> */}

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					className="text-foreground"
				/>
			</Paper>
		</Box>
	);
}
